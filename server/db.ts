
import { eq, desc, like, and, or } from "drizzle-orm";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  materials,
  InsertMaterial,
  suppliers,
  InsertSupplier,
  batches,
  InsertBatch,
  recipes,
  InsertRecipe,
  recipeIngredients,
  InsertRecipeIngredient,
  purchaseOrders,
  InsertPurchaseOrder,
  orders,
  InsertOrder,
  shipments,
  InsertShipment,
  warehouseLocations,
  InsertWarehouseLocation,
  featureFlags,
  InsertFeatureFlag,
} from "../drizzle/schema";
import { ENV } from './_core/env';

// Type for database instance - only MySQL in production
type DbInstance = ReturnType<typeof drizzleMysql>;

export let _db: DbInstance | null = null;
let _isLocalMode = false;

// In-memory storage for local development mode
const localStore = {
  users: new Map<string, any>(),
  materials: [] as any[],
  suppliers: [] as any[],
  batches: [] as any[],
  recipes: [] as any[],
  recipeIngredients: [] as any[],
  orders: [] as any[],
  purchaseOrders: [] as any[],
  shipments: [] as any[],
  warehouseLocations: [] as any[],
  featureFlags: [] as any[],
  idCounters: {
    materials: 1,
    suppliers: 1,
    batches: 1,
    recipes: 1,
    recipeIngredients: 1,
    orders: 1,
    purchaseOrders: 1,
    shipments: 1,
    warehouseLocations: 1,
    featureFlags: 1,
  },
};

export function isLocalDevMode(): boolean {
  return _isLocalMode;
}

export function setDb(db: DbInstance) {
  _db = db;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb(): Promise<DbInstance | null> {
  if (_db) return _db;

  // For testing, dynamically import better-sqlite3 to avoid bundling native module in production
  if (process.env.NODE_ENV === 'test') {
    const { drizzle: drizzleSqlite } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    const sqlite = new Database(':memory:');
    _db = drizzleSqlite(sqlite) as unknown as DbInstance;
    return _db;
  }

  // Local development mode - use in-memory storage
  if (ENV.localDevMode && !process.env.DATABASE_URL) {
    console.log("[Database] Running in local development mode with in-memory storage");
    _isLocalMode = true;
    return null;
  }

  if (process.env.DATABASE_URL) {
    try {
      _db = drizzleMysql(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  // Local development mode - use in-memory storage
  if (_isLocalMode) {
    const existing = localStore.users.get(user.openId);
    const now = new Date();
    localStore.users.set(user.openId, {
      id: existing?.id ?? localStore.users.size + 1,
      openId: user.openId,
      name: user.name ?? existing?.name ?? null,
      email: user.email ?? existing?.email ?? null,
      loginMethod: user.loginMethod ?? existing?.loginMethod ?? null,
      role: user.role ?? existing?.role ?? (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
      lastSignedIn: user.lastSignedIn ?? now,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    return;
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  // Local development mode - use in-memory storage
  if (_isLocalMode) {
    return localStore.users.get(openId);
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Materials Management
export async function getAllMaterials() {
  if (_isLocalMode) {
    return [...localStore.materials].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(materials).orderBy(desc(materials.createdAt));
}

export async function getMaterialById(id: number) {
  if (_isLocalMode) {
    return localStore.materials.find(m => m.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return result[0];
}

export async function createMaterial(material: InsertMaterial) {
  if (_isLocalMode) {
    const now = new Date();
    const newMaterial = {
      id: localStore.idCounters.materials++,
      ...material,
      createdAt: now,
      updatedAt: now,
    };
    localStore.materials.push(newMaterial);
    return { insertId: newMaterial.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(materials).values(material);
  return result;
}

export async function updateMaterial(id: number, material: Partial<InsertMaterial>) {
  if (_isLocalMode) {
    const idx = localStore.materials.findIndex(m => m.id === id);
    if (idx !== -1) {
      localStore.materials[idx] = { ...localStore.materials[idx], ...material, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(materials).set(material).where(eq(materials.id, id));
}

export async function deleteMaterial(id: number) {
  if (_isLocalMode) {
    localStore.materials = localStore.materials.filter(m => m.id !== id);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(materials).where(eq(materials.id, id));
}

// Suppliers Management
export async function getAllSuppliers() {
  if (_isLocalMode) {
    return [...localStore.suppliers].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
}

export async function getSupplierById(id: number) {
  if (_isLocalMode) {
    return localStore.suppliers.find(s => s.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
  return result[0];
}

export async function createSupplier(supplier: InsertSupplier) {
  if (_isLocalMode) {
    const now = new Date();
    const newSupplier = {
      id: localStore.idCounters.suppliers++,
      ...supplier,
      createdAt: now,
      updatedAt: now,
    };
    localStore.suppliers.push(newSupplier);
    return { insertId: newSupplier.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(suppliers).values(supplier);
  return result;
}

export async function updateSupplier(id: number, supplier: Partial<InsertSupplier>) {
  if (_isLocalMode) {
    const idx = localStore.suppliers.findIndex(s => s.id === id);
    if (idx !== -1) {
      localStore.suppliers[idx] = { ...localStore.suppliers[idx], ...supplier, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(suppliers).set(supplier).where(eq(suppliers.id, id));
}

export async function deleteSupplier(id: number) {
  if (_isLocalMode) {
    localStore.suppliers = localStore.suppliers.filter(s => s.id !== id);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(suppliers).where(eq(suppliers.id, id));
}

// Batches Management
export async function getAllBatches() {
  if (_isLocalMode) {
    return [...localStore.batches].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(batches).orderBy(desc(batches.createdAt));
}

export async function getBatchById(id: number) {
  if (_isLocalMode) {
    return localStore.batches.find(b => b.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(batches).where(eq(batches.id, id)).limit(1);
  return result[0];
}

export async function createBatch(batch: InsertBatch) {
  if (_isLocalMode) {
    const now = new Date();
    const newBatch = {
      id: localStore.idCounters.batches++,
      ...batch,
      createdAt: now,
      updatedAt: now,
    };
    localStore.batches.push(newBatch);
    return { insertId: newBatch.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(batches).values(batch);
  return result;
}

export async function updateBatch(id: number, batch: Partial<InsertBatch>) {
  if (_isLocalMode) {
    const idx = localStore.batches.findIndex(b => b.id === id);
    if (idx !== -1) {
      localStore.batches[idx] = { ...localStore.batches[idx], ...batch, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(batches).set(batch).where(eq(batches.id, id));
}

export async function deleteBatch(id: number) {
  if (_isLocalMode) {
    localStore.batches = localStore.batches.filter(b => b.id !== id);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(batches).where(eq(batches.id, id));
}

// Recipes Management
export async function getAllRecipes() {
  if (_isLocalMode) {
    return [...localStore.recipes].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
}

export async function getRecipeById(id: number) {
  if (_isLocalMode) {
    return localStore.recipes.find(r => r.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return result[0];
}

export async function createRecipe(recipe: InsertRecipe) {
  if (_isLocalMode) {
    const now = new Date();
    const newRecipe = {
      id: localStore.idCounters.recipes++,
      ...recipe,
      createdAt: now,
      updatedAt: now,
    };
    localStore.recipes.push(newRecipe);
    return { insertId: newRecipe.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(recipes).values(recipe);
  return result;
}

export async function updateRecipe(id: number, recipe: Partial<InsertRecipe>) {
  if (_isLocalMode) {
    const idx = localStore.recipes.findIndex(r => r.id === id);
    if (idx !== -1) {
      localStore.recipes[idx] = { ...localStore.recipes[idx], ...recipe, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(recipes).set(recipe).where(eq(recipes.id, id));
}

export async function deleteRecipe(id: number) {
  if (_isLocalMode) {
    localStore.recipes = localStore.recipes.filter(r => r.id !== id);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(recipes).where(eq(recipes.id, id));
}

// Recipe Ingredients
export async function getRecipeIngredients(recipeId: number) {
  if (_isLocalMode) {
    return localStore.recipeIngredients.filter(ri => ri.recipeId === recipeId);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
}

export async function addRecipeIngredient(ingredient: InsertRecipeIngredient) {
  if (_isLocalMode) {
    const now = new Date();
    const newIngredient = {
      id: localStore.idCounters.recipeIngredients++,
      ...ingredient,
      createdAt: now,
    };
    localStore.recipeIngredients.push(newIngredient);
    return { insertId: newIngredient.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(recipeIngredients).values(ingredient);
  return result;
}

export async function deleteRecipeIngredient(id: number) {
  if (_isLocalMode) {
    localStore.recipeIngredients = localStore.recipeIngredients.filter(ri => ri.id !== id);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(recipeIngredients).where(eq(recipeIngredients.id, id));
}

// Orders Management
export async function getAllOrders() {
  if (_isLocalMode) {
    return [...localStore.orders].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  if (_isLocalMode) {
    return localStore.orders.find(o => o.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function createOrder(order: InsertOrder) {
  if (_isLocalMode) {
    const now = new Date();
    const newOrder = {
      id: localStore.idCounters.orders++,
      ...order,
      createdAt: now,
      updatedAt: now,
    };
    localStore.orders.push(newOrder);
    return { insertId: newOrder.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function updateOrder(id: number, order: Partial<InsertOrder>) {
  if (_isLocalMode) {
    const idx = localStore.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      localStore.orders[idx] = { ...localStore.orders[idx], ...order, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(order).where(eq(orders.id, id));
}

// Shipments Management
export async function getAllShipments() {
  if (_isLocalMode) {
    return [...localStore.shipments].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(shipments).orderBy(desc(shipments.createdAt));
}

export async function getShipmentById(id: number) {
  if (_isLocalMode) {
    return localStore.shipments.find(s => s.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shipments).where(eq(shipments.id, id)).limit(1);
  return result[0];
}

export async function createShipment(shipment: InsertShipment) {
  if (_isLocalMode) {
    const now = new Date();
    const newShipment = {
      id: localStore.idCounters.shipments++,
      ...shipment,
      createdAt: now,
      updatedAt: now,
    };
    localStore.shipments.push(newShipment);
    return { insertId: newShipment.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(shipments).values(shipment);
  return result;
}

export async function updateShipment(id: number, shipment: Partial<InsertShipment>) {
  if (_isLocalMode) {
    const idx = localStore.shipments.findIndex(s => s.id === id);
    if (idx !== -1) {
      localStore.shipments[idx] = { ...localStore.shipments[idx], ...shipment, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shipments).set(shipment).where(eq(shipments.id, id));
}

// Warehouse Locations
export async function getAllWarehouseLocations() {
  if (_isLocalMode) {
    return [...localStore.warehouseLocations].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(warehouseLocations).orderBy(desc(warehouseLocations.createdAt));
}

export async function getWarehouseLocationById(id: number) {
  if (_isLocalMode) {
    return localStore.warehouseLocations.find(w => w.id === id);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(warehouseLocations).where(eq(warehouseLocations.id, id)).limit(1);
  return result[0];
}

export async function createWarehouseLocation(location: InsertWarehouseLocation) {
  if (_isLocalMode) {
    const now = new Date();
    const newLocation = {
      id: localStore.idCounters.warehouseLocations++,
      ...location,
      createdAt: now,
      updatedAt: now,
    };
    localStore.warehouseLocations.push(newLocation);
    return { insertId: newLocation.id };
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(warehouseLocations).values(location);
  return result;
}

export async function updateWarehouseLocation(id: number, location: Partial<InsertWarehouseLocation>) {
  if (_isLocalMode) {
    const idx = localStore.warehouseLocations.findIndex(w => w.id === id);
    if (idx !== -1) {
      localStore.warehouseLocations[idx] = { ...localStore.warehouseLocations[idx], ...location, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(warehouseLocations).set(location).where(eq(warehouseLocations.id, id));
}

// Feature Flags Management
export async function getAllFeatureFlags() {
  if (_isLocalMode) {
    return [...localStore.featureFlags].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(featureFlags).orderBy(desc(featureFlags.createdAt));
}

export async function getFeatureFlagByKey(key: string) {
  if (_isLocalMode) {
    return localStore.featureFlags.find(f => f.key === key);
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function isFeatureEnabled(key: string, userRole?: string): Promise<boolean> {
  const flag = await getFeatureFlagByKey(key);
  if (!flag || flag.enabled === 0) return false;
  if (flag.requiredRole === "admin" && userRole !== "admin") return false;
  return true;
}

export async function createFeatureFlag(flag: InsertFeatureFlag) {
  if (_isLocalMode) {
    const now = new Date();
    const newFlag = {
      id: localStore.idCounters.featureFlags++,
      ...flag,
      createdAt: now,
      updatedAt: now,
    };
    localStore.featureFlags.push(newFlag);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(featureFlags).values(flag);
}

export async function updateFeatureFlag(id: number, updates: Partial<InsertFeatureFlag>) {
  if (_isLocalMode) {
    const idx = localStore.featureFlags.findIndex(f => f.id === id);
    if (idx !== -1) {
      localStore.featureFlags[idx] = { ...localStore.featureFlags[idx], ...updates, updatedAt: new Date() };
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(featureFlags).set(updates).where(eq(featureFlags.id, id));
}

export async function toggleFeatureFlag(id: number) {
  if (_isLocalMode) {
    const idx = localStore.featureFlags.findIndex(f => f.id === id);
    if (idx !== -1) {
      localStore.featureFlags[idx].enabled = localStore.featureFlags[idx].enabled === 1 ? 0 : 1;
      localStore.featureFlags[idx].updatedAt = new Date();
    }
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const flag = await db.select().from(featureFlags).where(eq(featureFlags.id, id)).limit(1);
  if (flag.length > 0) {
    const newState = flag[0].enabled === 1 ? 0 : 1;
    await db.update(featureFlags).set({ enabled: newState }).where(eq(featureFlags.id, id));
  }
}

export async function deleteFeatureFlag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(featureFlags).where(eq(featureFlags.id, id));
}