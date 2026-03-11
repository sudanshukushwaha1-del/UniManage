import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for teachers and students.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["teacher", "student"]).default("student").notNull(),
  profileImage: text("profileImage"), // URL to profile image
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Student profile information
 */
export const studentProfiles = mysqlTable("studentProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  studentId: varchar("studentId", { length: 50 }).notNull().unique(), // Unique student ID
  department: varchar("department", { length: 100 }),
  semester: int("semester"),
  batch: varchar("batch", { length: 50 }), // e.g., "2024-2025"
  dateOfBirth: date("dateOfBirth"),
  address: text("address"),
  parentName: varchar("parentName", { length: 100 }),
  parentPhone: varchar("parentPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

/**
 * Teacher profile information
 */
export const teacherProfiles = mysqlTable("teacherProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeId: varchar("employeeId", { length: 50 }).notNull().unique(),
  department: varchar("department", { length: 100 }),
  specialization: varchar("specialization", { length: 100 }),
  qualification: varchar("qualification", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type InsertTeacherProfile = typeof teacherProfiles.$inferInsert;

/**
 * Courses/Subjects
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g., "CS101"
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  teacherId: int("teacherId").notNull(), // Reference to teacher
  department: varchar("department", { length: 100 }),
  semester: int("semester"),
  credits: int("credits"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Course enrollments (students enrolled in courses)
 */
export const courseEnrollments = mysqlTable("courseEnrollments", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  studentId: int("studentId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

/**
 * Attendance records
 */
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  studentId: int("studentId").notNull(),
  date: date("date").notNull(),
  status: mysqlEnum("status", ["present", "absent", "late"]).notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

/**
 * Lectures/Classes
 */
export const lectures = mysqlTable("lectures", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("endTime", { length: 10 }).notNull(), // HH:MM format
  room: varchar("room", { length: 100 }),
  building: varchar("building", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lecture = typeof lectures.$inferSelect;
export type InsertLecture = typeof lectures.$inferInsert;

/**
 * Assignments
 */
export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  dueDate: date("dueDate").notNull(),
  totalMarks: int("totalMarks").notNull(),
  createdBy: int("createdBy").notNull(), // Teacher ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

/**
 * Assignment submissions
 */
export const assignmentSubmissions = mysqlTable("assignmentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  assignmentId: int("assignmentId").notNull(),
  studentId: int("studentId").notNull(),
  submissionText: text("submissionText"),
  submissionFile: text("submissionFile"), // URL to uploaded file
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["submitted", "late", "not_submitted"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;

/**
 * Grades/Marks
 */
export const grades = mysqlTable("grades", {
  id: int("id").autoincrement().primaryKey(),
  assignmentId: int("assignmentId"),
  studentId: int("studentId").notNull(),
  courseId: int("courseId").notNull(),
  marksObtained: decimal("marksObtained", { precision: 5, scale: 2 }),
  totalMarks: decimal("totalMarks", { precision: 5, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  gradePoint: varchar("gradePoint", { length: 2 }), // A, B, C, etc.
  remarks: text("remarks"),
  gradedBy: int("gradedBy"), // Teacher ID
  gradedAt: timestamp("gradedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;

/**
 * Announcements/Notices
 */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId"),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  createdBy: int("createdBy").notNull(), // Teacher ID
  visibility: mysqlEnum("visibility", ["all", "students", "teachers"]).default("all").notNull(),
  isPinned: boolean("isPinned").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["assignment", "grade", "attendance", "lecture", "announcement"]).notNull(),
  relatedId: int("relatedId"), // ID of related entity (assignment, announcement, etc.)
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
