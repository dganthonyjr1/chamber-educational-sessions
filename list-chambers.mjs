import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";
import "dotenv/config";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

const orgs = await db.select().from(schema.organizations);

console.log("\n=== Current Chambers in Database ===\n");
orgs.forEach((org, idx) => {
  console.log(`${idx + 1}. ${org.name}`);
  console.log(`   City: ${org.city}, State: ${org.state}`);
  console.log(`   Website: ${org.website}`);
  console.log("");
});

console.log(`Total: ${orgs.length} organizations\n`);

await connection.end();
