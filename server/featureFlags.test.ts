import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Feature Flags System", () => {
  it("admin can create feature flag", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.featureFlags.create({
      key: `test_feature_${Date.now()}`,
      name: "Test Feature",
      description: "A test feature flag",
      enabled: 0,
      category: "testing",
      requiredRole: "user",
    });

    expect(result).toEqual({ success: true });
  });

  it("regular user cannot create feature flag", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.featureFlags.create({
        key: `test_feature_${Date.now()}`,
        name: "Test Feature",
        enabled: 0,
      })
    ).rejects.toThrow("Only admins can create feature flags");
  });

  it("admin can list all feature flags", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const flags = await caller.featureFlags.list();
    expect(Array.isArray(flags)).toBe(true);
  });

  it("admin can toggle feature flag", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a flag first
    const flagKey = `toggle_test_${Date.now()}`;
    await caller.featureFlags.create({
      key: flagKey,
      name: "Toggle Test",
      enabled: 0,
    });

    // Get the flag
    const flags = await caller.featureFlags.list();
    const flag = flags.find((f) => f.key === flagKey);
    expect(flag).toBeDefined();

    if (flag) {
      // Toggle it
      const result = await caller.featureFlags.toggle({ id: flag.id });
      expect(result).toEqual({ success: true });

      // Verify it's enabled
      const updatedFlag = await caller.featureFlags.get({ key: flagKey });
      expect(updatedFlag?.enabled).toBe(1);
    }
  });

  it("regular user cannot toggle feature flag", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.featureFlags.toggle({ id: 1 })
    ).rejects.toThrow("Only admins can toggle feature flags");
  });

  it("checks if feature is enabled correctly", async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // Create an enabled flag
    const flagKey = `enabled_test_${Date.now()}`;
    await adminCaller.featureFlags.create({
      key: flagKey,
      name: "Enabled Test",
      enabled: 1,
      requiredRole: "user",
    });

    // Check if enabled for regular user
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);
    const isEnabled = await userCaller.featureFlags.isEnabled({ key: flagKey });
    expect(isEnabled).toBe(true);
  });

  it("admin-only feature is not enabled for regular user", async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    // Create an admin-only flag
    const flagKey = `admin_only_test_${Date.now()}`;
    await adminCaller.featureFlags.create({
      key: flagKey,
      name: "Admin Only Test",
      enabled: 1,
      requiredRole: "admin",
    });

    // Check if enabled for regular user (should be false)
    const userCtx = createUserContext();
    const userCaller = appRouter.createCaller(userCtx);
    const isEnabled = await userCaller.featureFlags.isEnabled({ key: flagKey });
    expect(isEnabled).toBe(false);

    // Check if enabled for admin (should be true)
    const isEnabledForAdmin = await adminCaller.featureFlags.isEnabled({ key: flagKey });
    expect(isEnabledForAdmin).toBe(true);
  });

  it("admin can delete feature flag", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a flag
    const flagKey = `delete_test_${Date.now()}`;
    await caller.featureFlags.create({
      key: flagKey,
      name: "Delete Test",
      enabled: 0,
    });

    // Get the flag
    const flags = await caller.featureFlags.list();
    const flag = flags.find((f) => f.key === flagKey);
    expect(flag).toBeDefined();

    if (flag) {
      // Delete it
      const result = await caller.featureFlags.delete({ id: flag.id });
      expect(result).toEqual({ success: true });

      // Verify it's gone
      const deletedFlag = await caller.featureFlags.get({ key: flagKey });
      expect(deletedFlag).toBeUndefined();
    }
  });

  it("regular user cannot delete feature flag", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.featureFlags.delete({ id: 1 })
    ).rejects.toThrow("Only admins can delete feature flags");
  });
});
