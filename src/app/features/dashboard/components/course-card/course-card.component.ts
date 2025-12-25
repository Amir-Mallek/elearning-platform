import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrolledCourse } from '../../models/enrolled-course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
})
export class CourseCardComponent {
  @Input() enrolledCourse!: EnrolledCourse;
  @Output() continue = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();

  onContinue(): void {
    this.continue.emit();
  }

  onPlay(): void {
    this.play.emit();
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getTimeRemaining(): string {
    if (!this.enrolledCourse.dueDate) return '';

    const now = new Date();
    const due = new Date(this.enrolledCourse.dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 7) return `${days} days left`;
    if (days > 0) return `${days} days left`;
    return 'Due soon';
  }

  isOverdue(): boolean {
    if (!this.enrolledCourse.dueDate) return false;
    return new Date(this.enrolledCourse.dueDate) < new Date();
  }

  getProgressColor(): string {
    if (this.enrolledCourse.progress < 30) return 'bg-red-600';
    if (this.enrolledCourse.progress < 70) return 'bg-yellow-600';
    return 'bg-green-600';
  }
}
