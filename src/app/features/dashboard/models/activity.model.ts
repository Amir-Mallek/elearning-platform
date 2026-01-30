export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  courseId?: string;
  courseName?: string;
  timestamp: Date;
  metadata?: ActivityMetadata;
}

export enum ActivityType {
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  QUIZ_COMPLETED = 'QUIZ_COMPLETED',
  COURSE_STARTED = 'COURSE_STARTED',
  COURSE_COMPLETED = 'COURSE_COMPLETED',
  CERTIFICATE_EARNED = 'CERTIFICATE_EARNED',
  ASSIGNMENT_SUBMITTED = 'ASSIGNMENT_SUBMITTED',
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
}

export interface ActivityMetadata {
  score?: number;
  grade?: string;
  lessonTitle?: string;
  quizTitle?: string;
  points?: number;
  [key: string]: any;
}
