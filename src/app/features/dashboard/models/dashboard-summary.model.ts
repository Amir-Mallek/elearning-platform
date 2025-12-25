import { Achievement } from './achievement.model';
import { Activity } from './activity.model';
import { Certificate } from './certificate.model';
import { DashboardStats } from './dashboard-stats.model';
import { EnrolledCourse } from './enrolled-course.model';
import { LearningData } from './learning-data.model';

export interface DashboardSummary {
  stats: DashboardStats;
  enrolledCourses: EnrolledCourse[];
  recentActivities: Activity[];
  certificates: Certificate[];
  learningData: LearningData[];
  achievements: Achievement[];
  upcomingDeadlines: EnrolledCourse[];
}
