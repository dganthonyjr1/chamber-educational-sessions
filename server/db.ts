import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  courses, lessons, quizQuestions, userProgress, quizAttempts, chatMessages,
  InsertCourse, InsertLesson, InsertQuizQuestion, InsertUserProgress, InsertQuizAttempt, InsertChatMessage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Course functions
export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).orderBy(courses.order);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCourse(course: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(course);
  return result;
}

// Lesson functions
export async function getLessonsByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.order);
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLesson(lesson: InsertLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(lessons).values(lesson);
  return result;
}

export async function updateLesson(id: number, lesson: Partial<InsertLesson>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(lessons).set(lesson).where(eq(lessons.id, id));
}

// Quiz functions
export async function getQuizQuestionsByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizQuestions).where(eq(quizQuestions.courseId, courseId));
}

export async function createQuizQuestion(question: InsertQuizQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(quizQuestions).values(question);
}

// User progress functions
export async function getUserProgress(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProgress(progress: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserProgress(progress.userId, progress.lessonId);
  
  if (existing) {
    return db.update(userProgress)
      .set(progress)
      .where(and(
        eq(userProgress.userId, progress.userId),
        eq(userProgress.lessonId, progress.lessonId)
      ));
  } else {
    return db.insert(userProgress).values(progress);
  }
}

export async function getUserProgressByCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Join with lessons to filter by courseId
  return db.select({
    progress: userProgress,
    lesson: lessons
  })
  .from(userProgress)
  .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
  .where(and(
    eq(userProgress.userId, userId),
    eq(lessons.courseId, courseId)
  ));
}

// Quiz attempt functions
export async function createQuizAttempt(attempt: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(quizAttempts).values(attempt);
}

export async function getUserQuizAttempts(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.courseId, courseId)))
    .orderBy(desc(quizAttempts.completedAt));
}

export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users)
    .orderBy(desc(users.totalScore))
    .limit(limit);
}

export async function updateUserScore(userId: number, scoreToAdd: number, newStreak: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) return;
  
  const currentUser = user[0];
  const newTotalScore = currentUser.totalScore + scoreToAdd;
  const newBestStreak = Math.max(currentUser.bestStreak, newStreak);
  const newLevel = Math.floor(newTotalScore / 100) + 1;
  
  return db.update(users).set({
    totalScore: newTotalScore,
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    level: newLevel
  }).where(eq(users.id, userId));
}

// Chat functions
export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(chatMessages).values(message);
}

export async function getUserChatHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}
