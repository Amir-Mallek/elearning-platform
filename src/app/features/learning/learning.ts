import { Component, inject, Input } from '@angular/core';
import { CourseItem } from '../../shared/models/course-item.model';
import { Lesson } from '../../shared/models/lesson.model';
import { Course } from '../../shared/models/course.model';
import { Quiz } from '../../shared/models/quiz.model';
import { CourseItemType } from '../../shared/enums/course-item-type.enum';
import { CourseService } from '../../shared/services/course-service';

@Component({
  selector: 'app-learning',
  imports: [],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
export class Learning {
  @Input() course: Course | null = null;
  courseItems: CourseItem[] = [];
  currentItem: CourseItem | null = null;
  currentIndex: number = 0;
  completedItems: Set<string> = new Set();
  courseService = inject(CourseService);

  ngOnInit(): void {
    if (this.course) {
      this.loadCourse();
    }
  }

  loadCourse(): void {
    this.courseItems = this.courseService.getCourseItems(this.course?.id || '');

    // Load completed items from enrollment (mock for now)
    // In real implementation, get this from enrollment service
    this.completedItems = new Set();

    if (this.courseItems.length > 0) {
      this.selectItem(0);
    }
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

  isQuiz(item: CourseItem): item is Quiz {
    return item.type === CourseItemType.QUIZ;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
