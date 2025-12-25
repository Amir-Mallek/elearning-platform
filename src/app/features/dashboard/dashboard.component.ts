// ============================================
// dashboard.component.ts
// ============================================
import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

// Services
import { DashboardService } from './services/dashboard.service';
import { ProgressService } from './services/progress.service';
import { CertificateService } from './services/certificate.service';
import { ActivityService } from './services/activity.service';

// Components
import { StatsCardComponent } from './components/stats-card/stats-card.component';

// Models
import { DashboardStats } from './models/dashboard-stats.model';
import { EnrolledCourse } from './models/enrolled-course.model';
import { CourseCardComponent } from '@components/course-card/course-card';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { CertificateCardComponent } from './components/certificate-card/certificate-card.component';
import { CourseOverviewComponent } from './components/course-overview/course-overview.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';

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
  // ✅ Inject services using inject()
  private dashboardService = inject(DashboardService);
  private progressService = inject(ProgressService);
  private certificateService = inject(CertificateService);
  private activityService = inject(ActivityService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  // ✅ Convert Observables to Signals using toSignal()
  stats = toSignal(this.dashboardService.stats$, {
    initialValue: null,
  });

  courses = toSignal(this.dashboardService.courses$, {
    initialValue: [],
  });

  activities = toSignal(this.activityService.getRecentActivities(5), {
    initialValue: [],
  });

  certificates = toSignal(this.certificateService.certificates$, {
    initialValue: [],
  });

  loading = toSignal(this.dashboardService.loading$, {
    initialValue: false,
  });

  error = toSignal(this.dashboardService.error$, {
    initialValue: null,
  });

  // ✅ Local signals for component state
  selectedPeriod = signal<'week' | 'month'>('week');
  learningData = signal<any[]>([]);
  currentUser = signal({ name: 'Student' }); // TODO: Get from AuthService

  // ✅ Computed signals for derived data
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

    return data.reduce((sum, item) => sum + (item.hours || 0), 0);
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

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadCertificates();
    this.loadLearningData();

    // TODO: Set up user info
    // this.authService.currentUser$.subscribe(user => {
    //   this.currentUser.set(user);
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): void {
    this.dashboardService
      .loadDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Dashboard data loaded', data);
        },
        error: (err) => {
          console.error('Error loading dashboard:', err);
        },
      });
  }

  /**
   * Load certificates
   */
  loadCertificates(): void {
    this.certificateService
      .loadCertificates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.error('Error loading certificates:', err),
      });
  }

  /**
   * Load learning data for charts
   */
  loadLearningData(): void {
    this.progressService
      .getLearningData(this.selectedPeriod())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.learningData.set(data);
        },
        error: (err) => console.error('Error loading learning data:', err),
      });
  }

  /**
   * Handle period change for learning chart
   */
  onPeriodChange(period: 'week' | 'month'): void {
    this.selectedPeriod.set(period);
    this.loadLearningData();
  }

  /**
   * Navigate to course detail
   */
  onContinueCourse(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }

  /**
   * Navigate to course player
   */
  onPlayCourse(courseId: string): void {
    this.router.navigate(['/player', courseId]);
  }

  /**
   * Download certificate
   */
  onDownloadCertificate(certificateId: string): void {
    this.certificateService
      .downloadCertificate(certificateId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => console.log('Certificate downloaded'),
        error: (err) => console.error('Error downloading certificate:', err),
      });
  }

  /**
   * View all courses
   */
  viewAllCourses(): void {
    this.router.navigate(['/courses']);
  }

  /**
   * View all certificates
   */
  viewAllCertificates(): void {
    this.router.navigate(['/dashboard/certificates']);
  }

  /**
   * View all activities
   */
  viewAllActivities(): void {
    this.router.navigate(['/dashboard/activities']);
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
    this.loadCertificates();
    this.loadLearningData();
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.dashboardService.clearError();
  }

  /**
   * Navigate to course by deadline urgency
   */
  goToUrgentCourse(): void {
    const urgent = this.urgentCourses();
    if (urgent.length > 0) {
      this.onContinueCourse(urgent[0].course.id);
    }
  }

  /**
   * Format hours for display
   */
  formatHours(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  }

  /**
   * Calculate time remaining
   */
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
