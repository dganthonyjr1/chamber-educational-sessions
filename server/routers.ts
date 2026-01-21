import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as orgDb from "./db-organizations";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  courses: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCourses();
    }),
    
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        order: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCourse(input);
      }),
  }),

  lessons: router({
    listByCourse: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonsByCourseId(input.courseId);
      }),
    
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        order: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.createLesson(input);
      }),
    
    uploadThumbnail: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        fileData: z.string(), // base64
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `lessons/${input.lessonId}/thumbnail-${nanoid()}.${input.mimeType.split('/')[1]}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        await db.updateLesson(input.lessonId, {
          thumbnailUrl: url,
          thumbnailKey: fileKey,
        });
        
        return { url };
      }),
    
    uploadVideo: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        fileData: z.string(), // base64
        mimeType: z.string(),
        duration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileKey = `lessons/${input.lessonId}/video-${nanoid()}.${input.mimeType.split('/')[1]}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        await db.updateLesson(input.lessonId, {
          videoUrl: url,
          videoKey: fileKey,
          videoDuration: input.duration,
        });
        
        return { url };
      }),
  }),

  quiz: router({
    getQuestions: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getQuizQuestionsByCourseId(input.courseId);
      }),
    
    submitAttempt: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        score: z.number(),
        correctAnswers: z.number(),
        totalQuestions: z.number(),
        streak: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createQuizAttempt({
          userId: ctx.user.id,
          ...input,
        });
        
        await db.updateUserScore(ctx.user.id, input.score, input.streak);
        
        return { success: true };
      }),
    
    getAttempts: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserQuizAttempts(ctx.user.id, input.courseId);
      }),
  }),

  progress: router({
    update: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        completed: z.boolean().optional(),
        watchedSeconds: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const existing = await db.getUserProgress(ctx.user.id, input.lessonId);
        
        await db.upsertUserProgress({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          completed: input.completed ?? existing?.completed ?? false,
          watchedSeconds: input.watchedSeconds ?? existing?.watchedSeconds ?? 0,
          completedAt: input.completed ? new Date() : existing?.completedAt,
        });
        
        return { success: true };
      }),
    
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserProgressByCourse(ctx.user.id, input.courseId);
      }),
  }),

  chat: router({
    send: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Save user message
        await db.createChatMessage({
          userId: ctx.user.id,
          role: 'user',
          content: input.message,
        });
        
        // Get chat history
        const history = await db.getUserChatHistory(ctx.user.id, 10);
        
        // Build messages for LLM
        const messages = [
          {
            role: 'system' as const,
            content: 'You are an AI learning coach for the SIA AI Academy. Help users understand AI concepts for business, answer questions about the courses, and provide guidance on applying AI in their work. Be encouraging, practical, and focus on real-world business applications.',
          },
          ...history.reverse().map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ];
        
        // Get AI response
        const response = await invokeLLM({ messages });
        const rawContent = response.choices[0]?.message?.content;
        const aiMessage = typeof rawContent === 'string' ? rawContent : 'I apologize, but I encountered an error. Please try again.';
        
        // Save AI response
        await db.createChatMessage({
          userId: ctx.user.id,
          role: 'assistant',
          content: aiMessage,
        });
        
        return { message: aiMessage };
      }),
    
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserChatHistory(ctx.user.id);
    }),
  }),

  leaderboard: router({
    get: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getLeaderboard(input.limit);
      }),
  }),

  organizations: router({
    list: publicProcedure.query(async () => {
      return await orgDb.getAllOrganizations();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await orgDb.getOrganizationBySlug(input.slug);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
        signupUrl: z.string().optional(),
        primaryColor: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await orgDb.createOrganization(input);
      }),
  }),

  magicLink: router({
    create: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        organizationId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { token, expiresAt } = await orgDb.createMagicLink(input.email, input.organizationId);
        const magicUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'http://localhost:3000'}/auth/magic?token=${token}`;
        return { magicUrl, token, expiresAt };
      }),
    
    verify: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const link = await orgDb.useMagicLink(input.token);
        if (!link) {
          throw new Error('Invalid or expired magic link');
        }
        return { email: link.email, organizationId: link.organizationId };
      }),
  }),
});

export type AppRouter = typeof appRouter;
