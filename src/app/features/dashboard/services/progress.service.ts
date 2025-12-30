import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LearningData } from '../models/learning-data.model';
import { CourseProgress } from '../models/progress.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  constructor() {}

  // Return mock learning data for 'week' or 'month'
  getLearningData(period: 'week' | 'month' | 'year' = 'week'): Observable<LearningData[]> {
    const now = new Date();

    if (period === 'week') {
      const mockWeek: LearningData[] = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - (6 - i));
        return {
          date: day,
          hoursLearned: Math.round(Math.random() * 3),
          lessonsCompleted: Math.floor(Math.random() * 3),
          quizzesCompleted: Math.round(Math.random() * 1),
          coursesAccessed: Math.floor(Math.random() * 2),
        };
      });
      return of(mockWeek).pipe(delay(100));
    }

    // simple monthly aggregation (4 weeks)
    const mockMonth: LearningData[] = Array.from({ length: 4 }).map((_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (3 - i) * 7);
      return {
        date: weekStart,
        hoursLearned: Math.round(Math.random() * 12),
        lessonsCompleted: Math.floor(Math.random() * 10),
        quizzesCompleted: Math.floor(Math.random() * 3),
        coursesAccessed: Math.floor(Math.random() * 4),
      };
    });
    return of(mockMonth).pipe(delay(150));
  }

  // Mocked course progress for UI
  getCourseProgress(courseId: string): Observable<CourseProgress> {
    const mock: CourseProgress = {
      courseId,
      totalLessons: 20,
      completedLessons: 7,
      totalQuizzes: 3,
      completedQuizzes: 1,
      progressPercentage: 35,
      estimatedTimeRemaining: 3 * 3600,
      lastActivityDate: new Date(),
    };
    return of(mock).pipe(delay(80));
  }

  // Keep other methods as stubs to implement later (e.g. calculateStreak)
}
