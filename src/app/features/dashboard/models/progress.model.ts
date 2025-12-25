export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  progressPercentage: number;
  estimatedTimeRemaining: number; // in seconds
  lastActivityDate: Date;
}

export interface ProgressTrend {
  date: Date;
  cumulativeHours: number;
  cumulativeLessons: number;
  dailyHours: number;
  dailyLessons: number;
}
