import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as orgDb from "./db-organizations";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    totalScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: 1,
    organization: null,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("organizations", () => {
  it("lists all organizations publicly", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const orgs = await caller.organizations.list();

    expect(Array.isArray(orgs)).toBe(true);
    expect(orgs.length).toBeGreaterThan(0);
    expect(orgs[0]).toHaveProperty("name");
    expect(orgs[0]).toHaveProperty("slug");
  });

  it("gets organization by slug", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const org = await caller.organizations.getBySlug({ slug: "sudden-impact" });

    expect(org).toBeDefined();
    expect(org?.name).toBe("Sudden Impact Agency");
    expect(org?.slug).toBe("sudden-impact");
  });

  it("creates organization when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testSlug = `test-org-${Date.now()}`;
    
    await caller.organizations.create({
      name: "Test Organization",
      slug: testSlug,
      description: "Test description",
      primaryColor: "#ff0000",
    });

    // Verify it was created
    const org = await caller.organizations.getBySlug({ slug: testSlug });
    expect(org).toBeDefined();
    expect(org?.name).toBe("Test Organization");
  });
});

describe("magicLink", () => {
  it("creates magic link when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.magicLink.create({
      email: "newuser@example.com",
      organizationId: 1,
    });

    expect(result).toHaveProperty("magicUrl");
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("expiresAt");
    expect(result.magicUrl).toContain("/auth/magic?token=");
  });

  it("verifies valid magic link", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a magic link first
    const { token } = await caller.magicLink.create({
      email: "verify@example.com",
    });

    // Verify it
    const publicCaller = appRouter.createCaller(createPublicContext().ctx);
    const result = await publicCaller.magicLink.verify({ token });

    expect(result).toHaveProperty("email");
    expect(result.email).toBe("verify@example.com");
  });

  it("rejects invalid magic link", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext().ctx);

    await expect(
      publicCaller.magicLink.verify({ token: "invalid-token-123" })
    ).rejects.toThrow("Invalid or expired magic link");
  });

  it("rejects already used magic link", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create and use a magic link
    const { token } = await caller.magicLink.create({
      email: "used@example.com",
    });

    const publicCaller = appRouter.createCaller(createPublicContext().ctx);
    
    // First use should work
    await publicCaller.magicLink.verify({ token });

    // Second use should fail
    await expect(
      publicCaller.magicLink.verify({ token })
    ).rejects.toThrow("Invalid or expired magic link");
  });
});
