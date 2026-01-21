import { drizzle } from "drizzle-orm/mysql2";
import { courses, quizQuestions } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding courses and quiz questions...");

  // Create 4 courses
  const coursesData = [
    {
      title: "What Is AI?",
      description: "Understand the fundamentals of Artificial Intelligence and how it works in business contexts.",
      order: 1,
    },
    {
      title: "AI for Business Tasks",
      description: "Learn how to apply AI to automate and optimize common business operations.",
      order: 2,
    },
    {
      title: "AI for Business Growth",
      description: "Discover strategies to leverage AI for scaling your business and increasing revenue.",
      order: 3,
    },
    {
      title: "AI Safety & Ethics",
      description: "Navigate the responsible use of AI, including data privacy, bias, and ethical considerations.",
      order: 4,
    },
  ];

  await db.insert(courses).values(coursesData);
  console.log("✅ Courses created");

  // Quiz questions for Course 1: What Is AI?
  const course1Questions = [
    {
      courseId: 1,
      question: "What does AI stand for?",
      optionA: "Artificial Intelligence",
      optionB: "Advanced Internet",
      optionC: "Automated Integration",
      optionD: "Applied Innovation",
      correctOption: "A",
      explanation: "AI stands for Artificial Intelligence - computer systems designed to perform tasks that typically require human intelligence.",
      difficulty: "easy",
    },
    {
      courseId: 1,
      question: "Which of these is an AI tool?",
      optionA: "ChatGPT",
      optionB: "Microsoft Word",
      optionC: "Adobe Photoshop",
      optionD: "Slack",
      correctOption: "A",
      explanation: "ChatGPT is an AI tool. While Word and Photoshop have AI features, ChatGPT is specifically an AI language model.",
      difficulty: "easy",
    },
    {
      courseId: 1,
      question: "What is machine learning?",
      optionA: "AI that learns from data patterns",
      optionB: "A type of computer",
      optionC: "A programming language",
      optionD: "A cloud service",
      correctOption: "A",
      explanation: "Machine learning is a subset of AI where systems learn and improve from experience without being explicitly programmed.",
      difficulty: "medium",
    },
  ];

  // Quiz questions for Course 2: AI for Business Tasks
  const course2Questions = [
    {
      courseId: 2,
      question: "What can AI help you do in business?",
      optionA: "Save time on repetitive tasks",
      optionB: "Make coffee",
      optionC: "Replace all employees",
      optionD: "Predict the weather",
      correctOption: "A",
      explanation: "AI can save time on repetitive tasks like email drafting, data analysis, and customer service.",
      difficulty: "easy",
    },
    {
      courseId: 2,
      question: "Which business task is AI best for?",
      optionA: "Customer service automation",
      optionB: "Physical tasks",
      optionC: "Making decisions alone",
      optionD: "Replacing human judgment",
      correctOption: "A",
      explanation: "AI excels at automating customer service tasks like chatbots, email responses, and support tickets.",
      difficulty: "easy",
    },
    {
      courseId: 2,
      question: "What is a chatbot?",
      optionA: "An AI program that simulates conversation",
      optionB: "A robot that chats",
      optionC: "A messaging app",
      optionD: "A social media tool",
      correctOption: "A",
      explanation: "A chatbot is an AI program designed to simulate human conversation through text or voice.",
      difficulty: "medium",
    },
  ];

  // Quiz questions for Course 3: AI for Business Growth
  const course3Questions = [
    {
      courseId: 3,
      question: "How can small businesses use AI?",
      optionA: "Marketing automation, customer service, data analysis",
      optionB: "Only large companies can use AI",
      optionC: "AI is too expensive",
      optionD: "AI doesn't help small businesses",
      correctOption: "A",
      explanation: "Small businesses can use AI for marketing automation, customer service, data analysis, and more - many tools are affordable.",
      difficulty: "easy",
    },
    {
      courseId: 3,
      question: "What's the main benefit of AI for business growth?",
      optionA: "Increased efficiency and scalability",
      optionB: "Eliminating all employees",
      optionC: "Guaranteed profits",
      optionD: "No human oversight needed",
      correctOption: "A",
      explanation: "AI enables businesses to scale operations efficiently by automating processes and providing data-driven insights.",
      difficulty: "medium",
    },
    {
      courseId: 3,
      question: "Which AI model is known for generating images?",
      optionA: "DALL-E",
      optionB: "ChatGPT",
      optionC: "Gemini",
      optionD: "Claude",
      correctOption: "A",
      explanation: "DALL-E is an AI model specifically designed for generating images from text descriptions.",
      difficulty: "medium",
    },
  ];

  // Quiz questions for Course 4: AI Safety & Ethics
  const course4Questions = [
    {
      courseId: 4,
      question: "What is the main difference between AI and traditional software?",
      optionA: "AI can learn and adapt from data",
      optionB: "AI is always faster",
      optionC: "AI doesn't need programming",
      optionD: "AI only works online",
      correctOption: "A",
      explanation: "AI can learn and adapt from data, while traditional software follows pre-programmed rules exactly as written.",
      difficulty: "medium",
    },
    {
      courseId: 4,
      question: "What's the future of AI in business?",
      optionA: "More automation and efficiency gains",
      optionB: "AI will replace all jobs",
      optionC: "AI will disappear",
      optionD: "AI won't change business",
      correctOption: "A",
      explanation: "The future involves more automation, better decision-making, and increased efficiency across all business functions.",
      difficulty: "medium",
    },
    {
      courseId: 4,
      question: "Why is AI ethics important?",
      optionA: "To ensure responsible and fair use of AI",
      optionB: "It's not important",
      optionC: "Only for large companies",
      optionD: "To slow down innovation",
      correctOption: "A",
      explanation: "AI ethics ensures that AI systems are developed and used responsibly, fairly, and without harmful bias.",
      difficulty: "hard",
    },
  ];

  const allQuestions = [
    ...course1Questions,
    ...course2Questions,
    ...course3Questions,
    ...course4Questions,
  ];

  await db.insert(quizQuestions).values(allQuestions);
  console.log("✅ Quiz questions created");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
