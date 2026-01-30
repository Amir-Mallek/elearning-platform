import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { DashboardStats } from '../models/dashboard-stats.model';
import { EnrolledCourse } from '../models/enrolled-course.model';
import { Activity } from '../models/activity.model';
import { DashboardSummary } from '../models/dashboard-summary.model';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  private coursesSubject = new BehaviorSubject<EnrolledCourse[]>([]);
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private certificatesSubject = new BehaviorSubject<Certificate[]>([]);

  readonly stats$ = this.statsSubject.asObservable();
  readonly courses$ = this.coursesSubject.asObservable();
  readonly activities$ = this.activitiesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly certificates$ = this.certificatesSubject.asObservable();

  constructor() {}

  // Return a mocked DashboardSummary and populate internal subjects
  loadDashboardData(): Observable<DashboardSummary> {
    this.loadingSubject.next(true);
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const stats: DashboardStats = {
      coursesCompleted: 4,
      coursesInProgress: 3,
      hoursLearned: 14 * 3600,
      certificatesEarned: 2,
      currentStreak: 5,
      totalCourses: 12,
      averageRating: 4.7,
    };

    const courses: EnrolledCourse[] = [
      {
        course: {
          id: 'c1',
          title: 'Angular Fundamentals',
          instructorId: 'Jane Doe',
          thumbnail: 'https://picsum.photos/seed/angular/600/400',
          level: 'BEGINNER',
          durationInSeconds: 4 * 3600,
        } as any,
        enrollmentId: 'e1',
        enrolledDate: now,
        progress: 35,
        lastAccessedDate: now,
        nextLesson: 'Components & Templates',
        completedLessons: 7,
        completedQuizzes: 1,
        timeSpentInSeconds: 3600,
        dueDate: in3Days,
        status: 'IN_PROGRESS' as any,
      },
      {
        course: {
          id: 'c2',
          title: 'TypeScript Deep Dive',
          instructorId: 'John Smith',
          thumbnail: 'https://picsum.photos/seed/ts/600/400',
          level: 'INTERMEDIATE',
          durationInSeconds: 6 * 3600,
        } as any,
        enrollmentId: 'e2',
        enrolledDate: now,
        progress: 72,
        lastAccessedDate: now,
        nextLesson: 'Generics',
        completedLessons: 18,
        completedQuizzes: 3,
        timeSpentInSeconds: 2 * 3600,
        dueDate: tomorrow,
        status: 'IN_PROGRESS' as any,
      },
    ];

    const activities: Activity[] = [
      {
        id: 'a1',
        userId: 'u1',
        type: 'QUIZ_COMPLETED' as any,
        title: 'Completed Quiz: Angular Basics',
        description: 'Scored 85% on Angular Basics quiz',
        courseName: 'Angular Fundamentals',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        metadata: { score: 85 },
      },
    ];

    const certificates: Certificate[] = [
      {
        id: 'cert1',
        userId: 'u1',
        courseId: 'c3',
        courseTitle: 'CSS for Developers',
        instructorName: 'Alice Lee',
        issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        credentialId: 'ABC-123',
        certificateUrl: '#',
        thumbnailUrl: 'https://picsum.photos/seed/cert1/600/400',
        verificationUrl: '#',
        grade: 92,
        skills: ['CSS', 'Responsive Design'],
      } as any,
    ];

    const mockSummary: DashboardSummary = {
      stats,
      enrolledCourses: courses,
      recentActivities: activities,
      certificates,
      learningData: [],
      achievements: [],
      upcomingDeadlines: courses,
    };

    // simulate network and populate subjects
    return of(mockSummary).pipe(
      delay(150),
      tap((summary) => {
        this.statsSubject.next(summary.stats);
        this.coursesSubject.next(summary.enrolledCourses);
        this.activitiesSubject.next(summary.recentActivities);
        this.certificatesSubject.next(summary.certificates);
        this.loadingSubject.next(false);
      })
    );
  }

  loadStats() {
    return of(this.statsSubject.value).pipe(delay(50));
  }

  loadEnrolledCourses() {
    return of(this.coursesSubject.value).pipe(delay(50));
  }

  loadActivities(limit = 10) {
    return of(this.activitiesSubject.value.slice(0, limit)).pipe(delay(60));
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
