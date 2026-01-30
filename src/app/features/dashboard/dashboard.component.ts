// ============================================
// dashboard.component.ts
// ============================================
import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

// Services
import { DashboardService } from './services/dashboard.service';
import { ProgressService } from './services/progress.service';
import { CertificateService } from './services/certificate.service';
import { ActivityService } from './services/activity.service';

// Components
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { CourseCardComponent } from './components/course-card/course-card.component'; // <-- fixed relative path
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { CertificateCardComponent } from './components/certificate-card/certificate-card.component';
import { CourseOverviewComponent } from './components/course-overview/course-overview.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';

// Models
import { DashboardStats } from './models/dashboard-stats.model';
import { EnrolledCourse } from './models/enrolled-course.model';
import { Activity } from './models/activity.model';
import { Certificate } from './models/certificate.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    CourseCardComponent,
    ActivityFeedComponent,
    CertificateCardComponent,
    ProgressChartComponent,
    CourseOverviewComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Keep services injected so you can use them later (DI exercise)
  private dashboardService = inject(DashboardService);
  private progressService = inject(ProgressService);
  private certificateService = inject(CertificateService);
  private activityService = inject(ActivityService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  // ---- Mocked signals (UI will use these) ----
  stats = signal<DashboardStats | null>(null);
  courses = signal<EnrolledCourse[]>([]);
  activities = signal<Activity[]>([]);
  certificates = signal<Certificate[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Local state
  selectedPeriod = signal<'week' | 'month'>('week');
  learningData = signal<any[]>([]);
  currentUser = signal({ name: 'Student' });

  // Computed signals (use same names as template)
  inProgressCourses = computed(() =>
    this.courses().filter((c) => c.progress > 0 && c.progress < 100)
  );

  completedCourses = computed(() => this.courses().filter((c) => c.progress === 100));

  recentActivities = computed(() => this.activities().slice(0, 5));

  completionRate = computed(() => {
    const total = this.courses().length;
    const completed = this.completedCourses().length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  totalHoursThisWeek = computed(() => {
    const data = this.learningData();
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + (item.hoursLearned || 0), 0);
  });

  upcomingDeadlines = computed(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return this.inProgressCourses()
      .filter((course) => course.dueDate && new Date(course.dueDate) <= threeDaysFromNow)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  });

  urgentCourses = computed(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return this.inProgressCourses().filter(
      (course) => course.dueDate && new Date(course.dueDate) <= tomorrow
    );
  });

  recentCertificates = computed(() => this.certificates().slice(0, 3));

  // --------------------
  ngOnInit(): void {
    // Initialize UI with mocked data so the dashboard is immediately usable for UI exercises.
    this.setupMockData();
    // mark loading done
    this.loading.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --------------------
  private setupMockData(): void {
    // Simple stats
    this.stats.set({
      coursesCompleted: 4,
      coursesInProgress: 3,
      hoursLearned: 14 * 3600, // seconds
      certificatesEarned: 2,
      currentStreak: 5,
      totalCourses: 12,
      averageRating: 4.7,
    });

    // Mock courses (shallow objects; expand later as you implement models/services)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const mockCourses: EnrolledCourse[] = [
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
        enrolledDate: new Date(),
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
        enrolledDate: new Date(),
        progress: 72,
        lastAccessedDate: now,
        nextLesson: 'Generics',
        completedLessons: 18,
        completedQuizzes: 3,
        timeSpentInSeconds: 2 * 3600,
        dueDate: tomorrow,
        status: 'IN_PROGRESS' as any,
      },
      {
        course: {
          id: 'c3',
          title: 'CSS for Developers',
          instructorId: 'Alice Lee',
          thumbnail: 'https://picsum.photos/seed/css/600/400',
          level: 'BEGINNER',
          durationInSeconds: 2 * 3600,
        } as any,
        enrollmentId: 'e3',
        enrolledDate: new Date(),
        progress: 100,
        lastAccessedDate: now,
        nextLesson: '—',
        completedLessons: 12,
        completedQuizzes: 2,
        timeSpentInSeconds: 2 * 3600,
        status: 'COMPLETED' as any,
      },
    ];
    this.courses.set(mockCourses);

    // Mock activities
    const mockActivities: Activity[] = [
      {
        id: 'a1',
        userId: 'u1',
        type: 'QUIZ_COMPLETED' as any,
        title: 'Completed Quiz: Angular Basics',
        description: 'Scored 85% on Angular Basics quiz',
        courseName: 'Angular Fundamentals',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        metadata: { score: 85 },
      },
      {
        id: 'a2',
        userId: 'u1',
        type: 'LESSON_COMPLETED' as any,
        title: 'Finished lesson: Components & Templates',
        description: '',
        courseName: 'Angular Fundamentals',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1d ago
      },
      {
        id: 'a3',
        userId: 'u1',
        type: 'CERTIFICATE_EARNED' as any,
        title: 'Earned certificate: CSS for Developers',
        description: '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2d ago
      },
    ];
    this.activities.set(mockActivities);

    // Mock certificates
    const mockCertificates: Certificate[] = [
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
      {
        id: 'cert2',
        userId: 'u1',
        courseId: 'c4',
        courseTitle: 'HTML Advanced',
        instructorName: 'Bob',
        issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        credentialId: 'DEF-456',
        certificateUrl: '#',
        thumbnailUrl: 'https://picsum.photos/seed/cert2/600/400',
        verificationUrl: '#',
        grade: 88,
        skills: ['HTML', 'Accessibility'],
      } as any,
    ];
    this.certificates.set(mockCertificates);

    // Mock learning data for the progress chart
    const mockLearning = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      return {
        date: day,
        hoursLearned: Math.round(Math.random() * 3),
        lessonsCompleted: Math.floor(Math.random() * 3),
      };
    });
    this.learningData.set(mockLearning);
  }

  // --------------------
  // UI action stubs - keep these so you can implement real behaviour later
  onPeriodChange(period: 'week' | 'month'): void {
    this.selectedPeriod.set(period);
    // hint: call progressService.getLearningData(period) and set learningData
  }

  onContinueCourse(courseId: string): void {
    // hint: navigate to course detail or player
    this.router.navigate(['/courses', courseId]);
  }

  onPlayCourse(courseId: string): void {
    this.router.navigate(['/player', courseId]);
  }

  onDownloadCertificate(certificateId: string): void {
    // hint: call certificateService.downloadCertificate(certificateId)
    console.log('download certificate', certificateId);
  }

  viewAllCourses(): void {
    this.router.navigate(['/courses']);
  }

  viewAllCertificates(): void {
    this.router.navigate(['/dashboard/certificates']);
  }

  viewAllActivities(): void {
    this.router.navigate(['/dashboard/activities']);
  }

  refreshDashboard(): void {
    // Keep simple for now: re-setup mocks so the UI changes
    this.loading.set(true);
    setTimeout(() => {
      this.setupMockData();
      this.loading.set(false);
    }, 300);
  }

  clearError(): void {
    this.error.set(null);
  }

  goToUrgentCourse(): void {
    const urgent = this.urgentCourses();
    if (urgent.length > 0) {
      this.onContinueCourse(urgent[0].course.id as string);
    }
  }

  formatHours(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  }

  getTimeRemaining(dueDate: Date): string {
    const now = new Date();
    const diff = new Date(dueDate).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Due soon';
  }
}
