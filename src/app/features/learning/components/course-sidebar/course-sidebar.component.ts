import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseItem } from '@models/course-item.model';
import { Lesson } from '@models/lesson.model';
import { CourseItemType } from '@enums/course-item-type.enum';

@Component({
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-sidebar.component.html',
  styleUrl: './course-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSidebarComponent {
  @Input() courseItems: CourseItem[] = [];
  @Input() lastCompletedIndex: number = -1;
  @Input() currentItemId: string | null = null;
  @Input() courseTitle: string = '';

  @Output() itemSelected = new EventEmitter<number>();

  get progressPercentage(): number {
    if (this.courseItems.length === 0) return 0;
    const completedCount = this.lastCompletedIndex + 1;
    return Math.round((completedCount / this.courseItems.length) * 100);
  }

  get completedCount(): number {
    return Math.max(0, this.lastCompletedIndex + 1);
  }

  isItemCompleted(index: number): boolean {
    return index <= this.lastCompletedIndex;
  }

  isCurrentItem(itemId: string): boolean {
    return this.currentItemId === itemId;
  }

  onItemClick(index: number): void {
    this.itemSelected.emit(index);
  }

  isLesson(item: CourseItem): item is Lesson {
    return item.type === CourseItemType.LESSON;
  }

  isQuiz(item: CourseItem): boolean {
    return item.type === CourseItemType.QUIZ;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  trackByItemId(index: number, item: CourseItem): string {
    return item.id;
  }
}
