import { eq, and, gt } from "drizzle-orm";
import { getDb } from "./db";
import { organizations, magicLinks, users, InsertOrganization, InsertMagicLink } from "../drizzle/schema";
import { nanoid } from "nanoid";

// Organization functions
export async function getAllOrganizations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(organizations);
}

export async function getOrganizationBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrganizationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrganization(org: InsertOrganization) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(organizations).values(org);
}

export async function updateOrganizationMemberCount(orgId: number, increment: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const org = await getOrganizationById(orgId);
  if (!org) return;
  
  return db.update(organizations)
    .set({ memberCount: org.memberCount + increment })
    .where(eq(organizations.id, orgId));
}

// Magic link functions
export async function createMagicLink(email: string, organizationId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const linkData: InsertMagicLink = {
    token,
    email,
    organizationId,
    expiresAt,
  };
  
  await db.insert(magicLinks).values(linkData);
  
  return { token, expiresAt };
}

export async function getMagicLinkByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(magicLinks)
    .where(and(
      eq(magicLinks.token, token),
      gt(magicLinks.expiresAt, new Date())
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function useMagicLink(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const link = await getMagicLinkByToken(token);
  if (!link || link.usedAt) {
    return null;
  }
  
  // Mark as used
  await db.update(magicLinks)
    .set({ usedAt: new Date() })
    .where(eq(magicLinks.token, token));
  
  return link;
}

export async function getUsersByOrganization(organizationName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.organization, organizationName));
}
