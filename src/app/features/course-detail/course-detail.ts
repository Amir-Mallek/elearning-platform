import { Component, inject, signal, computed, effect } from '@angular/core';
import { Course } from '../../shared/models/course.model';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../shared/services/course.service';
import { FormatUtils } from '../../shared/utils/format.utils';
import { FormsModule } from '@angular/forms';
import { Review } from '../../shared/models/review.model';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    FormsModule
  ],
  styleUrls: ['./course-detail.css']
})
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  // ===== SIGNALS: UI State =====
  course = signal<Course | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Convert these to signals too for consistency
  isEnrolled = signal(false);
  isFavorited = signal(false);
  expandedModules = signal<Set<string>>(new Set());

  // Rating form state
  selectedRating = signal(0);
  hoverRating = signal(0);
  reviewComment = signal('');

  // ===== COMPUTED VALUES (auto-update when dependencies change) =====

  // Calculate average rating from reviews
  averageRating = computed(() => {
    const c = this.course();
    if (!c || !c.reviews?.length) return 0;

    const sum = c.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / c.reviews.length).toFixed(2));
  });

  // Total course duration
  totalDuration = computed(() => {
    const c = this.course();
    if (!c) return 0;

    return c.modules.reduce((total, module) => {
      return total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
    }, 0);
  });

  // Reviews count
  reviewsCount = computed(() => {
    return this.course()?.reviews?.length ?? 0;
  });

  formatUtils = FormatUtils;

  constructor() {
    // Load course with automatic cleanup
    this.route.params.pipe(
      map(params => params['courseId']),
      switchMap(id => {
        this.isLoading.set(true);
        this.error.set(null);
        console.log("Loading course with id:", id);
        return this.courseService.getCourseDetails(id).pipe(
          catchError(err => {
            console.error('Error loading course:', err);
            return of(null);
          })
        );
      }),
      takeUntilDestroyed() // ✅ Auto cleanup when component destroys
    ).subscribe({
      next: (courseData) => {
        this.course.set(courseData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load course');
        this.isLoading.set(false);
      }
    });
  }

  // ===== RATING METHODS =====

  setRating(rating: number): void {
    this.selectedRating.set(rating);
  }

  setHoverRating(rating: number): void {
    this.hoverRating.set(rating);
  }

  submitReview(): void {
    const rating = this.selectedRating();
    const comment = this.reviewComment();

    if (!rating) return;

    const newReview: Review = {
      id: Date.now().toString(), // Better ID generation
      userId: 'user123', // TODO: Get from auth service
      userName: 'You',
      userAvatar: '/assets/avatar.png',
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString()
    };
    this.courseService.addReview(this.course()?.id, newReview).subscribe({
      next: (updatedCourse) => {
        this.course.set(updatedCourse);  // ✅ Bridge: Observable → Signal

        // Reset form
        this.selectedRating.set(0);
        this.reviewComment.set('');
        this.hoverRating.set(0);
      },
      error: (err) => {
        console.error('Failed to submit review:', err);
        this.error.set('Failed to submit review. Please try again.');
      }
    });
  }

  // ===== MODULE EXPANSION =====

  toggleModule(moduleId: string): void {
    this.expandedModules.update(modules => {
      const newSet = new Set(modules);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules().has(moduleId);
  }

  // ===== COURSE ACTIONS =====

  toggleFavorite(): void {
    this.isFavorited.update(favorited => !favorited);
  }

  handleEnrollment(): void {
    if (this.isEnrolled()) {
      console.log("Navigating to course content...");
      // TODO: Navigate to course content
    } else {
      console.log("Processing enrollment...");
      // TODO: Call enrollment service
      this.isEnrolled.set(true);
    }
  }

  shareContent(): void {
    console.log("Sharing course...");
    // TODO: Implement share functionality
  }

  // ===== UTILITY METHODS =====

  getModuleDuration(moduleId: string): number {
    const c = this.course();
    if (!c) return 0;

    const module = c.modules.find(m => m.id === moduleId);
    if (!module) return 0;

    return module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  }

  getRatingPercentage(stars: number): number {
    const c = this.course();
    if (!c || !c.reviews?.length) return 0;

    const total = c.reviews.length;
    const count = c.reviews.filter(review => review.rating === stars).length;

    return Number(((count / total) * 100).toFixed(2));
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // Prevent infinite loop
    img.src = '/assets/placeholder-course.png'; // Fallback image
  }

  protected readonly window = window;
}
