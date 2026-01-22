import { drizzle } from "drizzle-orm/mysql2";
import { organizations } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function updateChamberLocations() {
  console.log("Updating Chamber locations with city and state...");

  // Update Wildwood Chamber with location data
  await db
    .update(organizations)
    .set({
      city: "Wildwood",
      state: "NJ",
    })
    .where(eq(organizations.slug, "wildwood-chamber"));

  console.log("✅ Chamber locations updated!");
}

updateChamberLocations().catch(console.error);
