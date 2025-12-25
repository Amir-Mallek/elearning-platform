import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity, ActivityType } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly apiUrl = '/api/activities';

  constructor(private http: HttpClient) {}

  /**
   * Get recent activities
   */
  getRecentActivities(limit = 20): Observable<Activity[]> {
    return this.http
      .get<Activity[]>(this.apiUrl, {
        params: { limit: limit.toString() },
      })
      .pipe(
        map((activities) =>
          activities.map((activity) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          }))
        )
      );
  }

  /**
   * Get activities by type
   */
  getActivitiesByType(type: ActivityType, limit = 10): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/type/${type}`, {
      params: { limit: limit.toString() },
    });
  }

  /**
   * Get activities for a specific course
   */
  getCourseActivities(courseId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/course/${courseId}`);
  }

  /**
   * Log a new activity
   */
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
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
    return this.http.get<any>(`${this.apiUrl}/feed`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
}
