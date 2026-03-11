import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check if user is teacher
const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "teacher") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only teachers can access this" });
  }
  return next({ ctx });
});

// Helper to check if user is student
const studentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "student") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only students can access this" });
  }
  return next({ ctx });
});

export const appRouter = router({
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

  // User Profile Routes
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (ctx.user.role === "student") {
        const profile = await db.getStudentProfile(ctx.user.id);
        return { user, profile };
      } else if (ctx.user.role === "teacher") {
        const profile = await db.getTeacherProfile(ctx.user.id);
        return { user, profile };
      }
      return { user, profile: null };
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        profileImage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return { success: true };
      }),
  }),

  // Course Routes
  course: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "teacher") {
        return await db.getCoursesByTeacher(ctx.user.id);
      } else {
        const enrollments = await db.getStudentCourses(ctx.user.id);
        return enrollments;
      }
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseById(input.id);
      }),

    create: teacherProcedure
      .input(z.object({
        code: z.string(),
        name: z.string(),
        description: z.string().optional(),
        department: z.string().optional(),
        semester: z.number().optional(),
        credits: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createCourse({
          code: input.code,
          name: input.name,
          description: input.description,
          department: input.department,
          semester: input.semester,
          credits: input.credits,
          teacherId: ctx.user.id,
        });
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        department: z.string().optional(),
        semester: z.number().optional(),
        credits: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.department !== undefined) updateData.department = data.department;
        if (data.semester !== undefined) updateData.semester = data.semester;
        if (data.credits !== undefined) updateData.credits = data.credits;
        return await db.updateCourse(id, updateData);
      }),

    enrollStudent: teacherProcedure
      .input(z.object({
        courseId: z.number(),
        studentId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.enrollStudent(input.courseId, input.studentId);
      }),

    getEnrolledStudents: teacherProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEnrolledStudents(input.courseId);
      }),
  }),

  // Attendance Routes
  attendance: router({
    mark: teacherProcedure
      .input(z.object({
        courseId: z.number(),
        studentId: z.number(),
        date: z.string(),
        status: z.enum(["present", "absent", "late"]),
        remarks: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.markAttendance({
          courseId: input.courseId,
          studentId: input.studentId,
          date: input.date as any,
          status: input.status as any,
          remarks: input.remarks,
        });
      }),

    getStudentAttendance: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        courseId: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "student" && input.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view other student's attendance" });
        }
        return await db.getStudentAttendance(input.studentId, input.courseId);
      }),

    getCourseAttendance: teacherProcedure
      .input(z.object({
        courseId: z.number(),
        date: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getCourseAttendance(input.courseId, input.date ? new Date(input.date) : undefined);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["present", "absent", "late"]),
      }))
      .mutation(async ({ input }) => {
        return await db.updateAttendance(input.id, input.status);
      }),

    getPercentage: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        courseId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "student" && input.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view other student's attendance percentage" });
        }
        const records = await db.getStudentAttendance(input.studentId, input.courseId);
        if (records.length === 0) return 0;
        const present = records.filter(r => r.status === "present").length;
        return (present / records.length) * 100;
      }),
  }),

  // Lecture Routes
  lecture: router({
    create: teacherProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        room: z.string().optional(),
        building: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createLecture({
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          date: input.date as any,
          startTime: input.startTime,
          endTime: input.endTime,
          room: input.room,
          building: input.building,
        });
      }),

    list: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseLectures(input.courseId);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getLectureById(input.id);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        room: z.string().optional(),
        building: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.date !== undefined) updateData.date = data.date as any;
        if (data.startTime !== undefined) updateData.startTime = data.startTime;
        if (data.endTime !== undefined) updateData.endTime = data.endTime;
        if (data.room !== undefined) updateData.room = data.room;
        if (data.building !== undefined) updateData.building = data.building;
        return await db.updateLecture(id, updateData);
      }),

    delete: teacherProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteLecture(input.id);
      }),
  }),

  // Assignment Routes
  assignment: router({
    create: teacherProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.string(),
        totalMarks: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createAssignment({
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate as any,
          totalMarks: input.totalMarks,
          createdBy: ctx.user.id,
        });
      }),

    list: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseAssignments(input.courseId);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssignmentById(input.id);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        totalMarks: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.dueDate !== undefined) updateData.dueDate = data.dueDate as any;
        if (data.totalMarks !== undefined) updateData.totalMarks = data.totalMarks;
        return await db.updateAssignment(id, updateData);
      }),

    delete: teacherProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteAssignment(input.id);
      }),

    submit: studentProcedure
      .input(z.object({
        assignmentId: z.number(),
        submissionText: z.string().optional(),
        submissionFile: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.submitAssignment({
          assignmentId: input.assignmentId,
          studentId: ctx.user.id,
          submissionText: input.submissionText,
          submissionFile: input.submissionFile,
          status: "submitted" as any,
        });
      }),

    getSubmissions: teacherProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssignmentSubmissions(input.assignmentId);
      }),

    getStudentSubmission: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        studentId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "student" && input.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view other student's submission" });
        }
        return await db.getStudentSubmission(input.assignmentId, input.studentId);
      }),
  }),

  // Grade Routes
  grade: router({
    create: teacherProcedure
      .input(z.object({
        assignmentId: z.number().optional(),
        studentId: z.number(),
        courseId: z.number(),
        marksObtained: z.number(),
        totalMarks: z.number(),
        remarks: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const percentage = (input.marksObtained / input.totalMarks) * 100;
        let gradePoint = "F";
        if (percentage >= 90) gradePoint = "A";
        else if (percentage >= 80) gradePoint = "B";
        else if (percentage >= 70) gradePoint = "C";
        else if (percentage >= 60) gradePoint = "D";

        return await db.createGrade({
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          courseId: input.courseId,
          marksObtained: input.marksObtained as any,
          totalMarks: input.totalMarks as any,
          percentage: percentage as any,
          gradePoint,
          remarks: input.remarks,
          gradedBy: ctx.user.id,
          gradedAt: new Date(),
        });
      }),

    getStudentGrades: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        courseId: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "student" && input.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view other student's grades" });
        }
        return await db.getStudentGrades(input.studentId, input.courseId);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        marksObtained: z.number().optional(),
        remarks: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.marksObtained !== undefined) updateData.marksObtained = data.marksObtained as any;
        if (data.remarks !== undefined) updateData.remarks = data.remarks;
        return await db.updateGrade(id, updateData);
      }),
  }),

  // Announcement Routes
  announcement: router({
    create: teacherProcedure
      .input(z.object({
        courseId: z.number().optional(),
        title: z.string(),
        content: z.string(),
        visibility: z.enum(["all", "students", "teachers"]).default("all"),
        isPinned: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createAnnouncement({
          courseId: input.courseId,
          title: input.title,
          content: input.content,
          visibility: input.visibility as any,
          isPinned: input.isPinned,
          createdBy: ctx.user.id,
        });
      }),

    list: protectedProcedure
      .input(z.object({ courseId: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getAnnouncements(input.courseId);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAnnouncementById(input.id);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        visibility: z.enum(["all", "students", "teachers"]).optional(),
        isPinned: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.visibility !== undefined) updateData.visibility = data.visibility as any;
        if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;
        return await db.updateAnnouncement(id, updateData);
      }),

    delete: teacherProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteAnnouncement(input.id);
      }),
  }),

  // Notification Routes
  notification: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.markNotificationAsRead(input.id);
      }),
  }),

  // Search Routes
  search: router({
    students: teacherProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchStudents(input.query);
      }),
  }),
});

export type AppRouter = typeof appRouter;
