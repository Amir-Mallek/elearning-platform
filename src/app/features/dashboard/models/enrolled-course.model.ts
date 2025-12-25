import { Course } from '@models/course.model';

export interface EnrolledCourse {
  course: Course;
  enrollmentId: string;
  enrolledDate: Date;
  progress: number; // 0-100
  lastAccessedDate: Date;
  nextLesson: string;
  completedLessons: number;
  completedQuizzes: number;
  timeSpentInSeconds: number;
  dueDate?: Date;
  status: EnrollmentStatus;
}

export enum EnrollmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}
