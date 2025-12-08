import { sql } from "drizzle-orm";
import { sqliteEnum, sqliteTable, text, integer, boolean, real } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(), // Changed varchar to text
  name: text("name"),
  email: text("email"), // Changed varchar to text
  loginMethod: text("loginMethod"), // Changed varchar to text
  role: sqliteEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Suppliers/Vendors
 */
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Changed varchar to text
  code: text("code").notNull().unique(), // Changed varchar to text
  contactPerson: text("contactPerson"), // Changed varchar to text
  email: text("email"), // Changed varchar to text
  phone: text("phone"), // Changed varchar to text
  address: text("address"),
  country: text("country"), // Changed varchar to text
  status: sqliteEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  rating: integer("rating").default(0),
  certifications: text("certifications"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

/**
 * Raw Materials and Products
 */
export const materials = sqliteTable("materials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Changed varchar to text
  sku: text("sku").notNull().unique(), // Changed varchar to text
  type: sqliteEnum("type", ["raw_material", "finished_product", "component"]).notNull(),
  description: text("description"),
  unit: text("unit").notNull(), // Changed varchar to text
  unitPrice: integer("unitPrice").default(0),
  reorderLevel: integer("reorderLevel").default(0),
  currentStock: integer("currentStock").default(0),
  supplierId: integer("supplierId"),
  category: text("category"), // Changed varchar to text
  imageUrl: text("imageUrl"),
  status: sqliteEnum("status", ["active", "discontinued", "out_of_stock"]).default("active").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = typeof materials.$inferInsert;

/**
 * Recipes/Bill of Materials
 */
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Changed varchar to text
  code: text("code").notNull().unique(), // Changed varchar to text
  productId: integer("productId").notNull(),
  version: text("version").default("1.0").notNull(), // Changed varchar to text
  description: text("description"),
  yieldQuantity: integer("yieldQuantity").notNull(),
  yieldUnit: text("yieldUnit").notNull(), // Changed varchar to text
  status: sqliteEnum("status", ["draft", "active", "archived"]).default("draft").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

/**
 * Recipe Ingredients
 */
export const recipeIngredients = sqliteTable("recipeIngredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipeId").notNull(),
  materialId: integer("materialId").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // Changed varchar to text
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type InsertRecipeIngredient = typeof recipeIngredients.$inferInsert;

/**
 * Batches
 */
export const batches = sqliteTable("batches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchNumber: text("batchNumber").notNull().unique(), // Changed varchar to text
  recipeId: integer("recipeId").notNull(),
  productId: integer("productId").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // Changed varchar to text
  status: sqliteEnum("status", ["planned", "in_progress", "completed", "failed", "on_hold"]).default("planned").notNull(),
  startDate: integer("startDate", { mode: 'timestamp' }),
  endDate: integer("endDate", { mode: 'timestamp' }),
  location: text("location"), // Changed varchar to text
  qrCode: text("qrCode"),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Batch = typeof batches.$inferSelect;
export type InsertBatch = typeof batches.$inferInsert;

/**
 * Purchase Orders
 */
export const purchaseOrders = sqliteTable("purchaseOrders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("orderNumber").notNull().unique(), // Changed varchar to text
  supplierId: integer("supplierId").notNull(),
  orderDate: integer("orderDate", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  expectedDeliveryDate: integer("expectedDeliveryDate", { mode: 'timestamp' }),
  actualDeliveryDate: integer("actualDeliveryDate", { mode: 'timestamp' }),
  status: sqliteEnum("status", ["draft", "submitted", "confirmed", "shipped", "delivered", "cancelled"]).default("draft").notNull(),
  totalAmount: integer("totalAmount").default(0),
  notes: text("notes"),
  createdBy: integer("createdBy").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = typeof purchaseOrders.$inferInsert;

/**
 * Purchase Order Items
 */
export const purchaseOrderItems = sqliteTable("purchaseOrderItems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseOrderId: integer("purchaseOrderId").notNull(),
  materialId: integer("materialId").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // Changed varchar to text
  unitPrice: integer("unitPrice").notNull(),
  totalPrice: integer("totalPrice").notNull(),
  receivedQuantity: integer("receivedQuantity").default(0),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;

/**
 * Inventory Transactions
 */
export const inventoryTransactions = sqliteTable("inventoryTransactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  materialId: integer("materialId").notNull(),
  transactionType: sqliteEnum("transactionType", ["receipt", "shipment", "adjustment", "production", "return"]).notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // Changed varchar to text
  referenceType: text("referenceType"), // Changed varchar to text
  referenceId: integer("referenceId"),
  location: text("location"), // Changed varchar to text
  notes: text("notes"),
  performedBy: integer("performedBy").notNull(),
  transactionDate: integer("transactionDate", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = typeof inventoryTransactions.$inferInsert;

/**
 * Warehouse Locations
 */
export const warehouseLocations = sqliteTable("warehouseLocations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Changed varchar to text
  code: text("code").notNull().unique(), // Changed varchar to text
  type: sqliteEnum("type", ["warehouse", "zone", "aisle", "rack", "bin"]).notNull(),
  parentId: integer("parentId"),
  capacity: integer("capacity"),
  currentUtilization: integer("currentUtilization").default(0),
  address: text("address"),
  status: sqliteEnum("status", ["active", "inactive", "maintenance"]).default("active").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type WarehouseLocation = typeof warehouseLocations.$inferSelect;
export type InsertWarehouseLocation = typeof warehouseLocations.$inferInsert;

/**
 * Shipments
 */
export const shipments = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shipmentNumber: text("shipmentNumber").notNull().unique(), // Changed varchar to text
  type: sqliteEnum("type", ["inbound", "outbound"]).notNull(),
  status: sqliteEnum("status", ["pending", "in_transit", "delivered", "cancelled"]).default("pending").notNull(),
  origin: text("origin"),
  destination: text("destination"),
  carrier: text("carrier"), // Changed varchar to text
  trackingNumber: text("trackingNumber"), // Changed varchar to text
  estimatedArrival: integer("estimatedArrival", { mode: 'timestamp' }),
  actualArrival: integer("actualArrival", { mode: 'timestamp' }),
  notes: text("notes"),
  createdBy: integer("createdBy").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

/**
 * Orders (Customer Orders)
 */
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("orderNumber").notNull().unique(), // Changed varchar to text
  customerName: text("customerName").notNull(), // Changed varchar to text
  customerEmail: text("customerEmail"), // Changed varchar to text
  customerPhone: text("customerPhone"), // Changed varchar to text
  shippingAddress: text("shippingAddress"),
  orderDate: integer("orderDate", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  requestedDeliveryDate: integer("requestedDeliveryDate", { mode: 'timestamp' }),
  status: sqliteEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  totalAmount: integer("totalAmount").default(0),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order Items
 */
export const orderItems = sqliteTable("orderItems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("orderId").notNull(),
  productId: integer("productId").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // Changed varchar to text
  unitPrice: integer("unitPrice").notNull(),
  totalPrice: integer("totalPrice").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Feature flags table for controlling feature visibility and access.
 * Allows granular control over features without code deployment.
 */
export const featureFlags = sqliteTable("featureFlags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(), // Changed varchar to text
  name: text("name").notNull(),
  description: text("description"),
  enabled: integer("enabled", { mode: 'boolean' }).default(false).notNull(), // 0 = false, 1 = true
  category: text("category"), // Changed varchar to text
  requiredRole: sqliteEnum("requiredRole", ["user", "admin"]).default("user"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;
