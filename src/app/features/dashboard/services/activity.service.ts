import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Activity, ActivityType } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor() {}

  /**
   * Get recent activities
   */
  getRecentActivities(limit = 20): Observable<Activity[]> {
    const now = Date.now();
    const mock: Activity[] = [
      {
        id: 'a1',
        userId: 'u1',
        type: ActivityType.QUIZ_COMPLETED,
        title: 'Completed Quiz: Angular Basics',
        description: 'Scored 85% on Angular Basics quiz',
        courseName: 'Angular Fundamentals',
        timestamp: new Date(now - 1000 * 60 * 60 * 2), // 2h ago
        metadata: { score: 85 },
      },
      {
        id: 'a2',
        userId: 'u1',
        type: ActivityType.LESSON_COMPLETED,
        title: 'Finished lesson: Components & Templates',
        description: '',
        courseName: 'Angular Fundamentals',
        timestamp: new Date(now - 1000 * 60 * 60 * 24), // 1d ago
      },
      {
        id: 'a3',
        userId: 'u1',
        type: ActivityType.CERTIFICATE_EARNED,
        title: 'Earned certificate: CSS for Developers',
        description: '',
        timestamp: new Date(now - 1000 * 60 * 60 * 48), // 2d ago
      },
    ];

    return of(mock.slice(0, limit)).pipe(delay(120));
  }

  /**
   * Get activities by type
   */
  getActivitiesByType(type: ActivityType, limit = 10): Observable<Activity[]> {
    // Method implementation can be added later
    return of([]);
  }

  /**
   * Get activities for a specific course
   */
  getCourseActivities(courseId: string): Observable<Activity[]> {
    // Method implementation can be added later
    return of([]);
  }

  /**
   * Log a new activity
   */
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Observable<Activity> {
    // Method implementation can be added later
    return of({} as Activity);
  }

  /**
   * Get activity feed with pagination
   */
  getActivityFeed(
    page = 1,
    pageSize = 10
  ): Observable<{
    activities: Activity[];
    totalCount: number;
    hasMore: boolean;
  }> {
    // Method implementation can be added later
    return of({
      activities: [],
      totalCount: 0,
      hasMore: false,
    });
  }
}
