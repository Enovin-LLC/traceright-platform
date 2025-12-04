import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Restoration Test Suite - Materials Management", () => {
  it("should list all materials", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const materials = await caller.materials.list();
    expect(Array.isArray(materials)).toBe(true);
  });

  it("should create a new material", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newMaterial = {
      name: "Test Material",
      sku: `TEST-${timestamp}`,
      type: "raw_material" as const,
      description: "Test material for restoration",
      unit: "kg",
      unitPrice: 1000,
      reorderLevel: 50,
      currentStock: 100,
      category: "Test Category",
      status: "active" as const,
    };

    const result = await caller.materials.create(newMaterial);
    expect(result).toBeDefined();
  });

  it("should update a material", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a material
    const timestamp = Date.now();
    await caller.materials.create({
      name: "Update Test Material",
      sku: `UPDATE-${timestamp}`,
      type: "component" as const,
      unit: "pcs",
      unitPrice: 500,
      status: "active" as const,
    });

    const materials = await caller.materials.list();
    const material = materials.find((m) => m.sku === `UPDATE-${timestamp}`);
    
    if (material) {
      const updateResult = await caller.materials.update({
        id: material.id,
        data: {
          name: "Updated Material Name",
          currentStock: 200,
        },
      });
      expect(updateResult.success).toBe(true);
    }
  });
});

describe("Restoration Test Suite - Suppliers Management", () => {
  it("should list all suppliers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const suppliers = await caller.suppliers.list();
    expect(Array.isArray(suppliers)).toBe(true);
  });

  it("should create a new supplier", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newSupplier = {
      name: "Test Supplier Inc",
      code: `SUP-${timestamp}`,
      contactPerson: "John Doe",
      email: "john@testsupplier.com",
      phone: "+1234567890",
      address: "123 Test Street",
      country: "USA",
      status: "active" as const,
      rating: 5,
    };

    const result = await caller.suppliers.create(newSupplier);
    expect(result).toBeDefined();
  });
});

describe("Restoration Test Suite - Batches Management", () => {
  it("should list all batches", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const batches = await caller.batches.list();
    expect(Array.isArray(batches)).toBe(true);
  });

  it("should create a new batch", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newBatch = {
      batchNumber: `BTH-TEST-${timestamp}`,
      recipeId: 1,
      productId: 1,
      quantity: 1000,
      unit: "units",
      status: "planned" as const,
      location: "Warehouse A",
    };

    const result = await caller.batches.create(newBatch);
    expect(result).toBeDefined();
  });
});

describe("Restoration Test Suite - Orders Management", () => {
  it("should list all orders", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const orders = await caller.orders.list();
    expect(Array.isArray(orders)).toBe(true);
  });

  it("should create a new order", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newOrder = {
      orderNumber: `ORD-TEST-${timestamp}`,
      customerName: "Test Customer",
      customerEmail: "customer@test.com",
      shippingAddress: "456 Customer Ave",
      status: "pending" as const,
      totalAmount: 50000,
    };

    const result = await caller.orders.create(newOrder);
    expect(result).toBeDefined();
  });
});

describe("Restoration Test Suite - Recipes Management", () => {
  it("should list all recipes", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const recipes = await caller.recipes.list();
    expect(Array.isArray(recipes)).toBe(true);
  });

  it("should create a new recipe", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newRecipe = {
      name: "Test Recipe",
      code: `RCP-${timestamp}`,
      productId: 1,
      version: "1.0",
      description: "Test recipe for restoration",
      yieldQuantity: 100,
      yieldUnit: "kg",
      status: "draft" as const,
    };

    const result = await caller.recipes.create(newRecipe);
    expect(result).toBeDefined();
  });
});

describe("Restoration Test Suite - Warehouse Management", () => {
  it("should list all warehouse locations", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const locations = await caller.warehouse.locations();
    expect(Array.isArray(locations)).toBe(true);
  });

  it("should create a new warehouse location", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newLocation = {
      name: "Test Warehouse",
      code: `WH-${timestamp}`,
      type: "warehouse" as const,
      capacity: 10000,
      currentUtilization: 0,
      address: "789 Warehouse Blvd",
      status: "active" as const,
    };

    const result = await caller.warehouse.createLocation(newLocation);
    expect(result).toBeDefined();
  });
});

describe("Restoration Test Suite - Shipments Management", () => {
  it("should list all shipments", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const shipments = await caller.shipments.list();
    expect(Array.isArray(shipments)).toBe(true);
  });

  it("should create a new shipment", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const newShipment = {
      shipmentNumber: `SHP-TEST-${timestamp}`,
      type: "outbound" as const,
      status: "pending" as const,
      origin: "Warehouse A",
      destination: "Customer Location",
      carrier: "Test Carrier",
      trackingNumber: "TRACK123456",
      createdBy: 1,
    };

    const result = await caller.shipments.create(newShipment);
    expect(result).toBeDefined();
  });
});
