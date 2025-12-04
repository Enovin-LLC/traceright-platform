import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Materials Management
  materials: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllMaterials();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMaterialById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        sku: z.string(),
        type: z.enum(["raw_material", "finished_product", "component"]),
        description: z.string().optional(),
        unit: z.string(),
        unitPrice: z.number().default(0),
        reorderLevel: z.number().default(0),
        currentStock: z.number().default(0),
        supplierId: z.number().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        status: z.enum(["active", "discontinued", "out_of_stock"]).default("active"),
      }))
      .mutation(async ({ input }) => {
        return await db.createMaterial(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          unit: z.string().optional(),
          unitPrice: z.number().optional(),
          reorderLevel: z.number().optional(),
          currentStock: z.number().optional(),
          supplierId: z.number().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          status: z.enum(["active", "discontinued", "out_of_stock"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateMaterial(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMaterial(input.id);
        return { success: true };
      }),
  }),

  // Suppliers Management
  suppliers: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllSuppliers();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSupplierById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        contactPerson: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        country: z.string().optional(),
        status: z.enum(["active", "inactive", "suspended"]).default("active"),
        rating: z.number().default(0),
        certifications: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createSupplier(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          contactPerson: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          country: z.string().optional(),
          status: z.enum(["active", "inactive", "suspended"]).optional(),
          rating: z.number().optional(),
          certifications: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateSupplier(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSupplier(input.id);
        return { success: true };
      }),
  }),

  // Batches Management
  batches: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllBatches();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBatchById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        batchNumber: z.string(),
        recipeId: z.number(),
        productId: z.number(),
        quantity: z.number(),
        unit: z.string(),
        status: z.enum(["planned", "in_progress", "completed", "failed", "on_hold"]).default("planned"),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        qrCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createBatch(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["planned", "in_progress", "completed", "failed", "on_hold"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          location: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateBatch(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBatch(input.id);
        return { success: true };
      }),
  }),

  // Recipes Management
  recipes: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllRecipes();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getRecipeById(input.id);
      }),
    getIngredients: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getRecipeIngredients(input.recipeId);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        productId: z.number(),
        version: z.string().default("1.0"),
        description: z.string().optional(),
        yieldQuantity: z.number(),
        yieldUnit: z.string(),
        status: z.enum(["draft", "active", "archived"]).default("draft"),
      }))
      .mutation(async ({ input }) => {
        return await db.createRecipe(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          version: z.string().optional(),
          yieldQuantity: z.number().optional(),
          yieldUnit: z.string().optional(),
          status: z.enum(["draft", "active", "archived"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateRecipe(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteRecipe(input.id);
        return { success: true };
      }),
  }),

  // Orders Management
  orders: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllOrders();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        orderNumber: z.string(),
        customerName: z.string(),
        customerEmail: z.string().optional(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string().optional(),
        requestedDeliveryDate: z.date().optional(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
        totalAmount: z.number().default(0),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createOrder(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateOrder(input.id, input.data);
        return { success: true };
      }),
  }),

  // Shipments Management
  shipments: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllShipments();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getShipmentById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        shipmentNumber: z.string(),
        type: z.enum(["inbound", "outbound"]),
        status: z.enum(["pending", "in_transit", "delivered", "cancelled"]).default("pending"),
        origin: z.string().optional(),
        destination: z.string().optional(),
        carrier: z.string().optional(),
        trackingNumber: z.string().optional(),
        estimatedArrival: z.date().optional(),
        actualArrival: z.date().optional(),
        notes: z.string().optional(),
        createdBy: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.createShipment(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["pending", "in_transit", "delivered", "cancelled"]).optional(),
          actualArrival: z.date().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateShipment(input.id, input.data);
        return { success: true };
      }),
  }),

  // Warehouse Locations
  warehouse: router({
    locations: protectedProcedure.query(async () => {
      return await db.getAllWarehouseLocations();
    }),
    getLocationById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getWarehouseLocationById(input.id);
      }),
    createLocation: protectedProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        type: z.enum(["warehouse", "zone", "aisle", "rack", "bin"]),
        parentId: z.number().optional(),
        capacity: z.number().optional(),
        currentUtilization: z.number().default(0),
        address: z.string().optional(),
        status: z.enum(["active", "inactive", "maintenance"]).default("active"),
      }))
      .mutation(async ({ input }) => {
        return await db.createWarehouseLocation(input);
      }),
    updateLocation: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          capacity: z.number().optional(),
          currentUtilization: z.number().optional(),
          status: z.enum(["active", "inactive", "maintenance"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateWarehouseLocation(input.id, input.data);
        return { success: true };
      }),
  }),

  // Feature Flags Management
  featureFlags: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllFeatureFlags();
    }),
    get: protectedProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
      return await db.getFeatureFlagByKey(input.key);
    }),
    isEnabled: protectedProcedure.input(z.object({ key: z.string() })).query(async ({ input, ctx }) => {
      return await db.isFeatureEnabled(input.key, ctx.user.role);
    }),
    create: protectedProcedure.input(z.object({
      key: z.string(),
      name: z.string(),
      description: z.string().optional(),
      enabled: z.number().default(0),
      category: z.string().optional(),
      requiredRole: z.enum(["user", "admin"]).default("user"),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create feature flags" });
      }
      await db.createFeatureFlag(input);
      return { success: true };
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        enabled: z.number().optional(),
        category: z.string().optional(),
        requiredRole: z.enum(["user", "admin"]).optional(),
      }),
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update feature flags" });
      }
      await db.updateFeatureFlag(input.id, input.data);
      return { success: true };
    }),
    toggle: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can toggle feature flags" });
      }
      await db.toggleFeatureFlag(input.id);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete feature flags" });
      }
      await db.deleteFeatureFlag(input.id);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
