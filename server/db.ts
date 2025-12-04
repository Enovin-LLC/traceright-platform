import { eq, desc, like, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(materials).orderBy(desc(materials.createdAt));
}

export async function getMaterialById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return result[0];
}

export async function createMaterial(material: InsertMaterial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(materials).values(material);
  return result;
}

export async function updateMaterial(id: number, material: Partial<InsertMaterial>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(materials).set(material).where(eq(materials.id, id));
}

export async function deleteMaterial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(materials).where(eq(materials.id, id));
}

// Suppliers Management
export async function getAllSuppliers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
}

export async function getSupplierById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
  return result[0];
}

export async function createSupplier(supplier: InsertSupplier) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(suppliers).values(supplier);
  return result;
}

export async function updateSupplier(id: number, supplier: Partial<InsertSupplier>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(suppliers).set(supplier).where(eq(suppliers.id, id));
}

export async function deleteSupplier(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(suppliers).where(eq(suppliers.id, id));
}

// Batches Management
export async function getAllBatches() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(batches).orderBy(desc(batches.createdAt));
}

export async function getBatchById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(batches).where(eq(batches.id, id)).limit(1);
  return result[0];
}

export async function createBatch(batch: InsertBatch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(batches).values(batch);
  return result;
}

export async function updateBatch(id: number, batch: Partial<InsertBatch>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(batches).set(batch).where(eq(batches.id, id));
}

export async function deleteBatch(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(batches).where(eq(batches.id, id));
}

// Recipes Management
export async function getAllRecipes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
}

export async function getRecipeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return result[0];
}

export async function createRecipe(recipe: InsertRecipe) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(recipes).values(recipe);
  return result;
}

export async function updateRecipe(id: number, recipe: Partial<InsertRecipe>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(recipes).set(recipe).where(eq(recipes.id, id));
}

export async function deleteRecipe(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(recipes).where(eq(recipes.id, id));
}

// Recipe Ingredients
export async function getRecipeIngredients(recipeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
}

export async function addRecipeIngredient(ingredient: InsertRecipeIngredient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(recipeIngredients).values(ingredient);
  return result;
}

export async function deleteRecipeIngredient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(recipeIngredients).where(eq(recipeIngredients.id, id));
}

// Orders Management
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function updateOrder(id: number, order: Partial<InsertOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(order).where(eq(orders.id, id));
}

// Shipments Management
export async function getAllShipments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(shipments).orderBy(desc(shipments.createdAt));
}

export async function getShipmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shipments).where(eq(shipments.id, id)).limit(1);
  return result[0];
}

export async function createShipment(shipment: InsertShipment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(shipments).values(shipment);
  return result;
}

export async function updateShipment(id: number, shipment: Partial<InsertShipment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shipments).set(shipment).where(eq(shipments.id, id));
}

// Warehouse Locations
export async function getAllWarehouseLocations() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(warehouseLocations).orderBy(desc(warehouseLocations.createdAt));
}

export async function getWarehouseLocationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(warehouseLocations).where(eq(warehouseLocations.id, id)).limit(1);
  return result[0];
}

export async function createWarehouseLocation(location: InsertWarehouseLocation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(warehouseLocations).values(location);
  return result;
}

export async function updateWarehouseLocation(id: number, location: Partial<InsertWarehouseLocation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(warehouseLocations).set(location).where(eq(warehouseLocations.id, id));
}

// Feature Flags Management
export async function getAllFeatureFlags() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(featureFlags).orderBy(desc(featureFlags.createdAt));
}

export async function getFeatureFlagByKey(key: string) {
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
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(featureFlags).values(flag);
}

export async function updateFeatureFlag(id: number, updates: Partial<InsertFeatureFlag>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(featureFlags).set(updates).where(eq(featureFlags.id, id));
}

export async function toggleFeatureFlag(id: number) {
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
