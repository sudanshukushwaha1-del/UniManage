import { eq, and, gte, lte, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, studentProfiles, teacherProfiles, courses, courseEnrollments, attendance, lectures, assignments, assignmentSubmissions, grades, announcements, notifications } from "../drizzle/schema";
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

    const textFields = ["name", "email", "loginMethod", "profileImage", "phone"] as const;
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Student Profile Queries
export async function getStudentProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStudentProfile(data: typeof studentProfiles.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(studentProfiles).values(data);
  return result;
}

// Teacher Profile Queries
export async function getTeacherProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTeacherProfile(data: typeof teacherProfiles.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(teacherProfiles).values(data);
  return result;
}

// Course Queries
export async function getCoursesByTeacher(teacherId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses).where(eq(courses.teacherId, teacherId));
}

export async function getCourseById(courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCourse(data: typeof courses.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(courses).values(data);
  return result;
}

export async function updateCourse(courseId: number, data: Partial<typeof courses.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(courses).set(data).where(eq(courses.id, courseId));
}

// Course Enrollment Queries
export async function getStudentCourses(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEnrollments).where(eq(courseEnrollments.studentId, studentId));
}

export async function enrollStudent(courseId: number, studentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(courseEnrollments).values({ courseId, studentId });
}

export async function getEnrolledStudents(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEnrollments).where(eq(courseEnrollments.courseId, courseId));
}

// Attendance Queries
export async function markAttendance(data: typeof attendance.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(attendance).values(data);
}

export async function getStudentAttendance(studentId: number, courseId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(attendance.studentId, studentId)];
  if (courseId) conditions.push(eq(attendance.courseId, courseId));
  return await db.select().from(attendance).where(and(...conditions));
}

export async function getCourseAttendance(courseId: number, date?: Date) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(attendance.courseId, courseId)];
  if (date) {
    const dateStr = date.toISOString().split('T')[0];
    conditions.push(eq(attendance.date, dateStr as any));
  }
  return await db.select().from(attendance).where(and(...conditions));
}

export async function updateAttendance(attendanceId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(attendance).set({ status: status as any }).where(eq(attendance.id, attendanceId));
}

// Lecture Queries
export async function createLecture(data: typeof lectures.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(lectures).values(data);
}

export async function getCourseLectures(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lectures).where(eq(lectures.courseId, courseId)).orderBy(desc(lectures.date));
}

export async function getLectureById(lectureId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lectures).where(eq(lectures.id, lectureId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLecture(lectureId: number, data: Partial<typeof lectures.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(lectures).set(data).where(eq(lectures.id, lectureId));
}

export async function deleteLecture(lectureId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(lectures).where(eq(lectures.id, lectureId));
}

// Assignment Queries
export async function createAssignment(data: typeof assignments.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(assignments).values(data);
}

export async function getCourseAssignments(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assignments).where(eq(assignments.courseId, courseId)).orderBy(desc(assignments.dueDate));
}

export async function getAssignmentById(assignmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assignments).where(eq(assignments.id, assignmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAssignment(assignmentId: number, data: Partial<typeof assignments.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(assignments).set(data).where(eq(assignments.id, assignmentId));
}

export async function deleteAssignment(assignmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(assignments).where(eq(assignments.id, assignmentId));
}

// Assignment Submission Queries
export async function submitAssignment(data: typeof assignmentSubmissions.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(assignmentSubmissions).values(data);
}

export async function getAssignmentSubmissions(assignmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignmentId));
}

export async function getStudentSubmission(assignmentId: number, studentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assignmentSubmissions).where(and(eq(assignmentSubmissions.assignmentId, assignmentId), eq(assignmentSubmissions.studentId, studentId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Grade Queries
export async function createGrade(data: typeof grades.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(grades).values(data);
}

export async function getStudentGrades(studentId: number, courseId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(grades.studentId, studentId)];
  if (courseId) conditions.push(eq(grades.courseId, courseId));
  return await db.select().from(grades).where(and(...conditions));
}

export async function updateGrade(gradeId: number, data: Partial<typeof grades.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(grades).set(data).where(eq(grades.id, gradeId));
}

// Announcement Queries
export async function createAnnouncement(data: typeof announcements.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(announcements).values(data);
}

export async function getAnnouncements(courseId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = courseId ? [eq(announcements.courseId, courseId)] : [];
  return await db.select().from(announcements).where(and(...conditions)).orderBy(desc(announcements.createdAt));
}

export async function getAnnouncementById(announcementId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(announcements).where(eq(announcements.id, announcementId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAnnouncement(announcementId: number, data: Partial<typeof announcements.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(announcements).set(data).where(eq(announcements.id, announcementId));
}

export async function deleteAnnouncement(announcementId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(announcements).where(eq(announcements.id, announcementId));
}

// Notification Queries
export async function createNotification(data: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}

export async function searchStudents(query: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).where(and(eq(users.role, "student"), like(users.name, `%${query}%`)));
}
