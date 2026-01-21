import { drizzle } from "drizzle-orm/mysql2";
import { bonusContent, courses, proTips } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding complete platform data...");

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

  // Add pro-tips with real business problems and AI solutions
  const tips = [
    {
      problem: "Spending hours responding to the same customer questions via email",
      solution: "Set up an AI-powered email assistant that drafts responses to common inquiries. It learns from your previous emails and maintains your tone, saving 10+ hours per week.",
      category: "Customer Service",
      difficulty: "beginner",
    },
    {
      problem: "Struggling to create consistent social media content across multiple platforms",
      solution: "Use AI to generate platform-specific content from a single brief. One idea becomes optimized posts for LinkedIn, Instagram, Facebook, and Twitter in minutes.",
      category: "Marketing",
      difficulty: "beginner",
    },
    {
      problem: "Losing leads because follow-ups fall through the cracks",
      solution: "Implement AI-driven lead nurturing that automatically sends personalized follow-ups based on prospect behavior, increasing conversion rates by 30-40%.",
      category: "Sales",
      difficulty: "intermediate",
    },
    {
      problem: "Spending too much time scheduling meetings and coordinating calendars",
      solution: "Deploy an AI scheduling assistant that handles back-and-forth emails, finds optimal meeting times, and sends calendar invites automatically.",
      category: "Operations",
      difficulty: "beginner",
    },
    {
      problem: "Difficulty analyzing customer feedback from multiple sources",
      solution: "Use AI sentiment analysis to automatically categorize and prioritize feedback from emails, surveys, and social media, identifying trends and urgent issues instantly.",
      category: "Customer Service",
      difficulty: "intermediate",
    },
    {
      problem: "Creating proposals and quotes takes hours of manual work",
      solution: "Build an AI system that generates customized proposals by pulling data from your CRM, past projects, and pricing models—reducing creation time from hours to minutes.",
      category: "Sales",
      difficulty: "intermediate",
    },
    {
      problem: "Struggling to keep website content fresh and SEO-optimized",
      solution: "Leverage AI to identify content gaps, generate SEO-optimized blog posts, and update existing pages based on current search trends and competitor analysis.",
      category: "Marketing",
      difficulty: "intermediate",
    },
    {
      problem: "Manual data entry eating up productive hours every week",
      solution: "Implement AI-powered document processing that extracts data from invoices, receipts, and forms, automatically populating your systems with 99% accuracy.",
      category: "Operations",
      difficulty: "beginner",
    },
    {
      problem: "Difficulty personalizing outreach at scale",
      solution: "Use AI to research prospects and generate personalized email openers based on their LinkedIn activity, company news, and industry trends—making every message feel custom-written.",
      category: "Sales",
      difficulty: "advanced",
    },
    {
      problem: "Customer support team overwhelmed with repetitive questions",
      solution: "Deploy an AI chatbot that handles 70% of common questions 24/7, escalating complex issues to human agents with full context and conversation history.",
      category: "Customer Service",
      difficulty: "intermediate",
    },
    {
      problem: "Struggling to understand which marketing channels drive real ROI",
      solution: "Use AI analytics to track customer journeys across all touchpoints, attributing revenue to specific campaigns and predicting which channels will perform best.",
      category: "Marketing",
      difficulty: "advanced",
    },
    {
      problem: "Onboarding new employees takes weeks of training time",
      solution: "Create an AI knowledge assistant that answers employee questions instantly, provides step-by-step guidance, and tracks common confusion points to improve training materials.",
      category: "Operations",
      difficulty: "intermediate",
    },
    {
      problem: "Missing opportunities because you can't monitor all industry news",
      solution: "Set up AI-powered news monitoring that scans thousands of sources daily, alerting you to relevant opportunities, competitor moves, and market shifts in real-time.",
      category: "Strategy",
      difficulty: "beginner",
    },
    {
      problem: "Inconsistent brand voice across different team members' content",
      solution: "Train a custom AI model on your best content to ensure every piece—from emails to social posts—maintains your unique brand voice and messaging standards.",
      category: "Marketing",
      difficulty: "advanced",
    },
    {
      problem: "Spending hours preparing for client meetings and presentations",
      solution: "Use AI to automatically compile client history, recent interactions, industry trends, and talking points into a pre-meeting brief in seconds.",
      category: "Sales",
      difficulty: "intermediate",
    },
  ];

  await db.insert(proTips).values(tips);
  console.log(`✅ ${tips.length} pro-tips created`);

  console.log("🎉 Complete seeding finished!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
