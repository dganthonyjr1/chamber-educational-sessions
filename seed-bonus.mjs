import { drizzle } from "drizzle-orm/mysql2";
import { bonusContent, courses } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding bonus content and advanced courses...");

  // Add bonus PDF
  await db.insert(bonusContent).values({
    title: "AI Visibility & Custom GPT Solutions - Complete Guide",
    description: "Unlock this comprehensive guide after completing all 4 foundational courses. Learn how to make your business visible to AI and create custom GPT solutions.",
    fileUrl: "/SIA_AI_Bonus_Guide.pdf",
    fileName: "SIA_AI_Bonus_Guide.pdf",
    requiredCoursesCompleted: 4,
  });
  console.log("✅ Bonus content created");

  // Add placeholder courses for advanced learning
  await db.insert(courses).values([
    {
      title: "Advanced AI Automation",
      description: "Coming Soon: Deep dive into advanced AI automation techniques, custom workflows, and enterprise-level AI integration strategies.",
      order: 5,
    },
    {
      title: "AI Leadership & Strategy",
      description: "Coming Soon: Learn how to lead AI transformation in your organization, build AI teams, and develop long-term AI strategies.",
      order: 6,
    },
  ]);
  console.log("✅ Advanced course placeholders created");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
