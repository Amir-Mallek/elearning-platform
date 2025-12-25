export interface LearningData {
  date: Date;
  hoursLearned: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  coursesAccessed: number;
}

export interface WeeklyLearningData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  totalLessons: number;
  averageSessionTime: number;
}

export interface MonthlyLearningData {
  month: number;
  year: number;
  totalHours: number;
  totalLessons: number;
  coursesCompleted: number;
  certificatesEarned: number;
}

export interface ProgressTrend {
  date: Date;
  cumulativeHours: number;
}
