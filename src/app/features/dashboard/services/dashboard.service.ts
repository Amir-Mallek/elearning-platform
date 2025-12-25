import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { map, shareReplay, switchMap, tap, catchError } from 'rxjs/operators';
import { DashboardStats } from '../models/dashboard-stats.model';
import { EnrolledCourse } from '../models/enrolled-course.model';
import { Activity } from '../models/activity.model';
import { DashboardSummary } from '../models/dashboard-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = '/api/dashboard';

  // ✅ RxJS BehaviorSubjects for reactive state management
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  private coursesSubject = new BehaviorSubject<EnrolledCourse[]>([]);
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // ✅ Public observables
  readonly stats$ = this.statsSubject.asObservable();
  readonly courses$ = this.coursesSubject.asObservable();
  readonly activities$ = this.activitiesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // ✅ Derived observables using RxJS operators
  readonly inProgressCourses$ = this.courses$.pipe(
    map((courses) => courses.filter((c) => c.progress > 0 && c.progress < 100)),
    shareReplay(1)
  );

  readonly completedCourses$ = this.courses$.pipe(
    map((courses) => courses.filter((c) => c.progress === 100)),
    shareReplay(1)
  );

  readonly upcomingDeadlines$ = this.courses$.pipe(
    map((courses) => {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return courses
        .filter((c) => c.dueDate && new Date(c.dueDate) <= threeDaysFromNow && c.progress < 100)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    }),
    shareReplay(1)
  );

  // ✅ Auto-refresh every 5 minutes
  private autoRefresh$ = interval(300000).pipe(switchMap(() => this.loadDashboardData()));

  constructor(private http: HttpClient) {
    // TODO: Uncomment to enable auto-refresh
    // this.autoRefresh$.subscribe();
  }

  /**
   * Load complete dashboard data
   * Combines multiple API calls into a single operation
   */
  loadDashboardData(): Observable<DashboardSummary> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`).pipe(
      tap((data) => {
        this.statsSubject.next(data.stats);
        this.coursesSubject.next(data.enrolledCourses);
        this.activitiesSubject.next(data.recentActivities);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.errorSubject.next('Failed to load dashboard data');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Load dashboard statistics
   */
  loadStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.apiUrl}/stats`)
      .pipe(tap((stats) => this.statsSubject.next(stats)));
  }

  /**
   * Load enrolled courses for the current user
   */
  loadEnrolledCourses(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Observable<EnrolledCourse[]> {
    let httpParams = new HttpParams();

    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http
      .get<EnrolledCourse[]>(`${this.apiUrl}/courses`, { params: httpParams })
      .pipe(tap((courses) => this.coursesSubject.next(courses)));
  }

  /**
   * Load recent activities
   */
  loadActivities(limit = 10): Observable<Activity[]> {
    return this.http
      .get<Activity[]>(`${this.apiUrl}/activities`, {
        params: { limit: limit.toString() },
      })
      .pipe(tap((activities) => this.activitiesSubject.next(activities)));
  }

  /**
   * Get a specific enrolled course
   */
  getEnrolledCourse(courseId: string): Observable<EnrolledCourse> {
    return this.http.get<EnrolledCourse>(`${this.apiUrl}/courses/${courseId}`);
  }

  /**
   * Update course progress
   */
  updateCourseProgress(courseId: string, progress: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/courses/${courseId}/progress`, {
      progress,
    });
  }

  /**
   * Mark lesson as completed
   */
  markLessonCompleted(courseId: string, lessonId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/courses/${courseId}/lessons/${lessonId}/complete`,
      {}
    );
  }

  /**
   * Get learning streak data
   */
  getStreakData(): Observable<{ currentStreak: number; longestStreak: number }> {
    return this.http.get<{ currentStreak: number; longestStreak: number }>(`${this.apiUrl}/streak`);
  }

  /**
   * Refresh all dashboard data
   */
  refresh(): void {
    this.loadDashboardData().subscribe();
  }

  /**
   * Reset error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
