import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";
import "dotenv/config";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// SHCCNJ data
const shccnj = {
  name: "Statewide Hispanic Chamber of Commerce of New Jersey",
  nameEs: "Cámara de Comercio Hispana Estatal de Nueva Jersey",
  slug: "shccnj",
  description:
    "The largest Chamber of Commerce in New Jersey, representing over 150,000 Latino-owned businesses and 7,000+ members statewide. SHCCNJ provides training, advocacy, networking, and business development resources to help businesses grow and thrive.",
  descriptionEs:
    "La Cámara de Comercio más grande de Nueva Jersey, representando más de 150,000 negocios propiedad de latinos y más de 7,000 miembros en todo el estado. SHCCNJ proporciona capacitación, defensa, networking y recursos de desarrollo empresarial para ayudar a las empresas a crecer y prosperar.",
  city: "Statewide",
  state: "NJ",
  latitude: 40.7357, // Newark coordinates (central NJ)
  longitude: -74.1724,
  website: "https://shccnj.org",
  signupUrl: "https://shccnj.org/membership/",
  linkedinUrl: "https://www.linkedin.com/company/statewide-hispanic-chamber-of-commerce-of-nj",
  facebookUrl: "https://www.facebook.com/SHCCNJ/",
  twitterUrl: "https://x.com/SHCCNJ",
  instagramUrl: "https://www.instagram.com/shccnj/",
  tiktokUrl: null,
};

console.log("Adding SHCCNJ to database...");

try {
  const result = await db.insert(schema.organizations).values(shccnj);
  console.log("✅ SHCCNJ added successfully!");
  console.log("Result:", result);
} catch (error) {
  console.error("❌ Error adding SHCCNJ:", error);
}

await connection.end();
