import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  
  // Gamification fields
  totalScore: int("totalScore").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  bestStreak: int("bestStreak").default(0).notNull(),
  level: int("level").default(1).notNull(),
  organization: varchar("organization", { length: 255 }), // Chamber or partner organization
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Courses table
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEs: varchar("titleEs", { length: 255 }), // Spanish title
  description: text("description"),
  descriptionEs: text("descriptionEs"), // Spanish description
  order: int("order").notNull(), // 1, 2, 3, 4 for the 4 courses
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// Lessons table
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnailUrl"), // S3 URL for lesson thumbnail
  thumbnailKey: varchar("thumbnailKey", { length: 512 }), // S3 key for thumbnail
  videoUrl: text("videoUrl"), // S3 URL for video
  videoKey: varchar("videoKey", { length: 512 }), // S3 key for video
  videoDuration: int("videoDuration"), // Duration in seconds
  order: int("order").notNull(), // Order within the course
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// Quiz questions table
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(), // Which course this quiz belongs to
  question: text("question").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctOption: mysqlEnum("correctOption", ["A", "B", "C", "D"]).notNull(),
  explanation: text("explanation"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("easy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

// User progress tracking
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  watchedSeconds: int("watchedSeconds").default(0).notNull(), // Track video progress
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

// Quiz attempts tracking
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  score: int("score").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  streak: int("streak").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

// Chat history
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Organizations table
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEs: varchar("nameEs", { length: 255 }), // Spanish name
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  description: text("description"),
  descriptionEs: text("descriptionEs"), // Spanish description
  logoUrl: text("logoUrl"), // S3 URL for organization logo
  website: text("website"),
  signupUrl: text("signupUrl"), // URL to join/signup page
  primaryColor: varchar("primaryColor", { length: 7 }), // Hex color for branding
  memberCount: int("memberCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

// Magic links table
export const magicLinks = mysqlTable("magic_links", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  organizationId: int("organizationId"),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicLink = typeof magicLinks.$inferSelect;
export type InsertMagicLink = typeof magicLinks.$inferInsert;

// Bonus content table
export const bonusContent = mysqlTable("bonus_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("fileUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  requiredCoursesCompleted: int("requiredCoursesCompleted").default(4).notNull(), // Number of courses to complete
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BonusContent = typeof bonusContent.$inferSelect;
export type InsertBonusContent = typeof bonusContent.$inferInsert;

// Pro-tips table - Business problems and AI solutions (lesson-specific)
export const proTips = mysqlTable("pro_tips", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(), // Links tip to specific lesson
  problem: text("problem").notNull(), // Business problem relevant to this lesson
  solution: text("solution").notNull(), // AI solution taught in this lesson
  order: int("order").default(1).notNull(), // Display order within lesson
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProTip = typeof proTips.$inferSelect;
export type InsertProTip = typeof proTips.$inferInsert;