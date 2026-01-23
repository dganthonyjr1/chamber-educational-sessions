import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as orgDb from "./db-organizations";
import { proTips, bonusContent } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  
  retell: router({
    getAccessToken: publicProcedure
      .input(z.object({ agentId: z.string().optional() }).optional())
      .mutation(async ({ input }) => {
        const RETELL_API_KEY = process.env.RETELL_API_KEY;
        const RETELL_AGENT_ID = input?.agentId || process.env.RETELL_AGENT_ID;

        if (!RETELL_API_KEY) {
          throw new Error('RETELL_API_KEY not configured. Please add it to Settings → Secrets.');
        }

        if (!RETELL_AGENT_ID) {
          throw new Error('RETELL_AGENT_ID not configured. Please add it to Settings → Secrets.');
        }

        try {
          const response = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RETELL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agent_id: RETELL_AGENT_ID,
            }),
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Retell API error: ${error}`);
          }

          const data = await response.json();
          return { accessToken: data.access_token };
        } catch (error) {
          console.error('[Retell] Failed to create web call:', error);
          throw new Error('Failed to initialize voice call. Please check Retell AI credentials.');
        }
      }),
  }),
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

    createLesson: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        titleEs: z.string(),
        description: z.string(),
        descriptionEs: z.string(),
        videoData: z.string(), // base64
        videoType: z.string(),
        thumbnailData: z.string().nullable(),
        thumbnailType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Create lesson first
        const lessons = await db.getLessonsByCourseId(input.courseId);
        const order = lessons.length + 1;
        
        const lesson = await db.createLesson({
          courseId: input.courseId,
          title: input.title,
          titleEs: input.titleEs,
          description: input.description,
          descriptionEs: input.descriptionEs,
          order,
        });

        // Upload video to S3
        const videoBuffer = Buffer.from(input.videoData.split(',')[1], 'base64');
        const videoKey = `lessons/${lesson.id}/video-${nanoid()}.${input.videoType.split('/')[1]}`;
        const { url: videoUrl } = await storagePut(videoKey, videoBuffer, input.videoType);

        // Upload thumbnail if provided
        let thumbnailUrl = null;
        let thumbnailKey = null;
        if (input.thumbnailData && input.thumbnailType) {
          const thumbnailBuffer = Buffer.from(input.thumbnailData.split(',')[1], 'base64');
          thumbnailKey = `lessons/${lesson.id}/thumbnail-${nanoid()}.${input.thumbnailType.split('/')[1]}`;
          const result = await storagePut(thumbnailKey, thumbnailBuffer, input.thumbnailType);
          thumbnailUrl = result.url;
        }

        // Update lesson with URLs
        await db.updateLesson(lesson.id, {
          videoUrl,
          videoKey,
          thumbnailUrl,
          thumbnailKey,
        });

        return { ...lesson, videoUrl, thumbnailUrl };
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

    // For large video files (up to 1 hour), use direct upload
    uploadVideoDirectly: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Generate unique file key
        const fileExt = input.fileName.split('.').pop() || 'mp4';
        const fileKey = `lessons/${input.lessonId}/video-${nanoid()}.${fileExt}`;
        
        // Return the file key and upload endpoint
        // Frontend will upload directly to S3 via the storage API
        return {
          fileKey,
          uploadEndpoint: `/api/storage/upload?key=${encodeURIComponent(fileKey)}`,
        };
      }),

    confirmVideoUpload: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        fileKey: z.string(),
        videoUrl: z.string(),
        duration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateLesson(input.lessonId, {
          videoUrl: input.videoUrl,
          videoKey: input.fileKey,
          videoDuration: input.duration,
        });
        
        return { success: true };
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

    get: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserProgress(ctx.user.id, input.lessonId);
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

  proTips: router({
    getByLesson: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        // Get pro-tips for this specific lesson
        return db.select().from(proTips)
          .where(eq(proTips.lessonId, input.lessonId));
      }),
  }),

  location: router({
    detectChamber: publicProcedure.query(async ({ ctx }) => {
      const { getLocationFromIP, findClosestChamber } = await import("./geolocation");
      
      // Get user IP from request
      const ip = ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress || "127.0.0.1";
      const userIP = Array.isArray(ip) ? ip[0] : ip.split(",")[0];
      
      console.log(`[Location Detection] User IP: ${userIP}`);
      
      // Get user location from IP
      const location = await getLocationFromIP(userIP);
      console.log(`[Location Detection] Detected location:`, location);
      
      // Get all Chambers
      const chambers = await orgDb.getAllOrganizations();
      
      // Find closest Chamber
      if (location.latitude && location.longitude && chambers.length > 0) {
        const closestChamber = findClosestChamber(
          location.latitude,
          location.longitude,
          chambers
        );
        
        return {
          location,
          chamber: closestChamber,
        };
      }
      
      // Fallback to first Chamber (Wildwood) if location detection fails
      return {
        location,
        chamber: chambers[0] ? { ...chambers[0], distance: 0 } : null,
      };
    }),
  }),

  // Public API for ChatGPT Custom GPT integration
  gpt: router({
    findChamber: publicProcedure
      .input(
        z.object({
          city: z.string().optional(),
          state: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const { getLocationFromIP, findClosestChamber } = await import("./geolocation");
        const chambers = await orgDb.getAllOrganizations();

        // If coordinates provided, use them directly
        if (input.latitude && input.longitude) {
          const closestChamber = findClosestChamber(
            input.latitude,
            input.longitude,
            chambers
          );
          return {
            success: true,
            chamber: closestChamber,
            searchMethod: "coordinates",
          };
        }

        // If city/state provided, find matching Chamber
        if (input.city && input.state) {
          const matchingChamber = chambers.find(
            (c) =>
              c.city?.toLowerCase() === input.city?.toLowerCase() &&
              c.state?.toLowerCase() === input.state?.toLowerCase()
          );

          if (matchingChamber) {
            return {
              success: true,
              chamber: { ...matchingChamber, distance: 0 },
              searchMethod: "city_state",
            };
          }

          // If no exact match, find nearest Chamber to the city
          // This would require geocoding the city/state to coordinates
          // For now, return all NJ chambers as suggestions
          return {
            success: false,
            message: `No Chamber found for ${input.city}, ${input.state}. Here are nearby options:`,
            suggestions: chambers.slice(0, 5),
            searchMethod: "city_state",
          };
        }

        // If no input provided, return all Chambers
        return {
          success: true,
          chambers: chambers,
          searchMethod: "all",
        };
      }),

    listAllChambers: publicProcedure.query(async () => {
      const chambers = await orgDb.getAllOrganizations();
      return {
        success: true,
        count: chambers.length,
        chambers: chambers.map((c) => ({
          id: c.id,
          name: c.name,
          city: c.city,
          state: c.state,
          website: c.website,
          signupUrl: c.signupUrl,
          description: c.description,
          socialMedia: {
            linkedin: c.linkedinUrl,
            facebook: c.facebookUrl,
            twitter: c.twitterUrl,
            instagram: c.instagramUrl,
            tiktok: c.tiktokUrl,
          },
        })),
      };
    }),
  }),

  bonus: router({
    getAvailable: protectedProcedure.query(async ({ ctx }) => {
      const dbInstance = await getDb();
      if (!dbInstance) return [];
      
      // Get all courses
      const allCourses = await db.getAllCourses();
      
      // Count completed courses
      let completedCount = 0;
      for (const course of allCourses) {
        const progress = await db.getUserProgressByCourse(ctx.user.id, course.id);
        const courseCompleted = progress.every(p => p.progress.completed);
        if (courseCompleted && progress.length > 0) {
          completedCount++;
        }
      }
      
      // Get bonus content that user has unlocked
      const bonuses = await dbInstance.select().from(bonusContent);
      return bonuses.filter(b => completedCount >= b.requiredCoursesCompleted);
    }),
  }),
});

export type AppRouter = typeof appRouter;
