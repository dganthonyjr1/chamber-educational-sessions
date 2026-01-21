import { drizzle } from "drizzle-orm/mysql2";
import { organizations } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding organizations...");

  const orgsData = [
    {
      name: "Sudden Impact Agency",
      slug: "sudden-impact",
      logoUrl: null,
      website: "https://suddenimpactagency.com",
      description: "Digital marketing and AI automation agency helping businesses grow.",
      signupUrl: "https://suddenimpactagency.com/join",
      primaryColor: "#ff006e",
      memberCount: 0,
    },
    {
      name: "Local Chamber of Commerce",
      slug: "local-chamber",
      logoUrl: null,
      website: "https://example-chamber.com",
      description: "Supporting local businesses with networking, education, and advocacy.",
      signupUrl: "https://example-chamber.com/membership",
      primaryColor: "#00d9ff",
      memberCount: 45,
    },
    {
      name: "Tech Entrepreneurs Network",
      slug: "tech-entrepreneurs",
      logoUrl: null,
      website: "https://techentrepreneurs.example",
      description: "Community of technology entrepreneurs and innovators.",
      signupUrl: "https://techentrepreneurs.example/join",
      primaryColor: "#8b5cf6",
      memberCount: 0,
    },
  ];

  await db.insert(organizations).values(orgsData);
  console.log("✅ Organizations created");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
