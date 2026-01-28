import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CourseItem } from '@models/course-item.model';
import { Lesson } from '@models/lesson.model';
import { Course } from '@models/course.model';
import { CourseItemType } from '@enums/course-item-type.enum';
import { CourseService } from '@services/course.service';
import { EnrollmentService } from '@services/enrollment.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { combineLatest, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learning',
  imports: [RouterOutlet, CourseSidebarComponent, CommonModule],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
export class Learning implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private destroy$ = new Subject<void>();

  courseId: string = '';
  course: Course | null = null;
  courseItems: CourseItem[] = [];
  currentItem: CourseItem | null = null;
  currentIndex: number = 0;
  lastCompletedIndex: number = -1;

  ngOnInit(): void {
    this.loadCourseData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourseData(): void {
    this.route.params
      .pipe(
        tap((params) => {
          this.courseId = params['courseId'];
        }),
        switchMap((params) =>
          combineLatest([
            this.courseService.getCourseDetails(params['courseId']),
            this.courseService.getCourseItems(params['courseId']),
            this.enrollmentService.getEnrollment(params['courseId']),
          ]),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: ([course, courseItems, enrollment]) => {
          this.course = course;
          this.courseItems = courseItems;
          this.lastCompletedIndex = enrollment.lastCompleted;

          // Navigate to first item if none selected
          if (this.courseItems.length > 0 && !this.currentItem) {
            this.selectItem(0);
          }
        },
      });
  }

  selectItem(index: number): void {
    if (index >= 0 && index < this.courseItems.length) {
      this.currentIndex = index;
      this.currentItem = this.courseItems[index];

      switch (this.courseItems[index].type) {
        case CourseItemType.LESSON:
          this.router.navigate(['lesson', this.courseItems[index].id], {
            relativeTo: this.route,
          });
          break;
        case CourseItemType.QUIZ:
          this.router.navigate(['quiz', this.courseItems[index].id], {
            relativeTo: this.route,
          });
          break;
      }
    }
  }

  markAsComplete(): void {
    if (this.currentItem) {
      // Only mark complete if this is the next item to complete (sequential progress)
      // Or if it's already before or at the last completed index
      if (this.currentIndex > this.lastCompletedIndex) {
        this.enrollmentService
          .updateLastCompleted(this.courseId, this.currentIndex)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (enrollment) => {
              this.lastCompletedIndex = enrollment.lastCompleted;
            },
          });
      }
    }
  }

  isItemCompleted(index: number): boolean {
    return index <= this.lastCompletedIndex;
  }

  goToNextItem(): void {
    if (this.currentIndex < this.courseItems.length - 1) {
      this.selectItem(this.currentIndex + 1);
    }
  }

  goToPreviousItem(): void {
    if (this.currentIndex > 0) {
      this.selectItem(this.currentIndex - 1);
    }
  }

  get progressPercentage(): number {
    if (this.courseItems.length === 0) return 0;
    const completedCount = this.lastCompletedIndex + 1;
    return Math.round((completedCount / this.courseItems.length) * 100);
  }

  get hasNext(): boolean {
    return this.currentIndex < this.courseItems.length - 1;
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get isCurrentItemCompleted(): boolean {
    return this.isItemCompleted(this.currentIndex);
  }

  isLesson(item: CourseItem): item is Lesson {
    return item.type === CourseItemType.LESSON;
  }

  isQuiz(item: CourseItem): boolean {
    return item.type === CourseItemType.QUIZ;
  }
}
