import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
import {
  LearningData,
  WeeklyLearningData,
  MonthlyLearningData,
  ProgressTrend,
} from '../models/learning-data.model';
import { CourseProgress } from '../models/progress.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly apiUrl = '/api/progress';

  constructor(private http: HttpClient) {}

  /**
   * Get learning data for charts
   */
  getLearningData(period: 'week' | 'month' | 'year'): Observable<LearningData[]> {
    return this.http
      .get<LearningData[]>(`${this.apiUrl}/learning-data`, {
        params: { period },
      })
      .pipe(
        map((data) =>
          data.map((item) => ({
            ...item,
            date: new Date(item.date),
          }))
        )
      );
  }

  /**
   * Get weekly learning summary
   */
  getWeeklyData(): Observable<WeeklyLearningData[]> {
    return this.http.get<WeeklyLearningData[]>(`${this.apiUrl}/weekly`).pipe(
      map((data) =>
        data.map((week) => ({
          ...week,
          startDate: new Date(week.startDate),
          endDate: new Date(week.endDate),
        }))
      )
    );
  }

  /**
   * Get monthly learning summary
   */
  getMonthlyData(): Observable<MonthlyLearningData[]> {
    return this.http.get<MonthlyLearningData[]>(`${this.apiUrl}/monthly`);
  }

  /**
   * Get progress trend with cumulative data
   */
  getProgressTrend(days = 30): Observable<ProgressTrend[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/trend`, {
        params: { days: days.toString() },
      })
      .pipe(
        map((data) =>
          data.map((item) => ({
            date: new Date(item.date),
            dailyHours: item.hours,
            dailyLessons: item.lessons,
            cumulativeHours: 0,
            cumulativeLessons: 0,
          }))
        ),
        // ✅ Use scan to calculate cumulative values
        scan((acc, curr) => {
          return curr.map((item, index) => {
            const prevCumulative =
              index > 0
                ? curr[index - 1]
                : acc.length > 0
                ? acc[acc.length - 1]
                : { cumulativeHours: 0, cumulativeLessons: 0 };

            return {
              ...item,
              cumulativeHours: prevCumulative.cumulativeHours + item.dailyHours,
              cumulativeLessons: prevCumulative.cumulativeLessons + item.dailyLessons,
            };
          });
        }, [] as ProgressTrend[])
      );
  }

  /**
   * Get course-specific progress
   */
  getCourseProgress(courseId: string): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.apiUrl}/courses/${courseId}`);
  }

  /**
   * Calculate learning streak
   */
  calculateStreak(): Observable<{ currentStreak: number; longestStreak: number }> {
    return this.http.get<any[]>(`${this.apiUrl}/daily-activity`).pipe(
      map((activities) => {
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // TODO: Implement streak calculation logic
        // Sort activities by date descending
        // Check for consecutive days
        // Update currentStreak and longestStreak

        return { currentStreak, longestStreak };
      })
    );
  }

  /**
   * Get total hours learned
   */
  getTotalHoursLearned(): Observable<number> {
    return this.http
      .get<{ totalHours: number }>(`${this.apiUrl}/total-hours`)
      .pipe(map((response) => response.totalHours));
  }

  /**
   * Get progress summary for a specific period
   */
  getProgressSummary(
    startDate: Date,
    endDate: Date
  ): Observable<{
    totalHours: number;
    totalLessons: number;
    totalQuizzes: number;
    averageSessionTime: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/summary`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  }
}
