import { Component, inject, Input, Signal } from '@angular/core';
import { CourseItem } from '@models/course-item.model';
import { Lesson } from '@models/lesson.model';
import { Course } from '@models/course.model';
import { CourseItemType } from '../../shared/enums/course-item-type.enum';
import { CourseService } from '../../shared/services/course.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-learning',
  imports: [RouterOutlet],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
export class Learning {
  route = inject(ActivatedRoute);
  courseService = inject(CourseService);
  courseId: string = '';
  course!: Course;
  courseItems: CourseItem[] = [];
  currentItem: CourseItem | null = null;
  currentIndex: number = 0;
  completedItems: Set<string> = new Set();

  constructor() {
    this.loadCourse();
    this.loadCourseItems();
  }

  loadCourse() {
    this.route.params
      .pipe(
        map((params) => params['courseId']),
        switchMap((id) => this.courseService.getCourseDetails(id)),
      )
      .subscribe({
        next: (course) => {
          this.course = course;
        },
      });
  }

  loadCourseItems() {
    this.route.params
      .pipe(
        map((params) => params['courseId']),
        switchMap((id) => {
          this.courseId = id;
          return this.courseService.getCourseItems(id);
        }),
      )
      .subscribe({
        next: (courseItems) => {
          this.courseItems = courseItems;
          this.completedItems = new Set();
          if (this.courseItems.length > 0) {
            this.selectItem(0);
          }
        },
      });
  }

  selectItem(index: number): void {
    if (index >= 0 && index < this.courseItems.length) {
      this.currentIndex = index;
      this.currentItem = this.courseItems[index];
    }
  }

  markAsComplete(): void {
    if (this.currentItem) {
      this.completedItems.add(this.currentItem.id);
      // In real implementation, save to backend via enrollment service
    }
  }

  isItemCompleted(itemId: string): boolean {
    return this.completedItems.has(itemId);
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
    return Math.round((this.completedItems.size / this.courseItems.length) * 100);
  }

  get hasNext(): boolean {
    return this.currentIndex < this.courseItems.length - 1;
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  isLesson(item: CourseItem): item is Lesson {
    return item.type === CourseItemType.LESSON;
  }

  isQuiz(item: CourseItem) {
    return item.type === CourseItemType.QUIZ;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
