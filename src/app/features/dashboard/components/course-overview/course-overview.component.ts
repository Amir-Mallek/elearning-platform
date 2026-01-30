import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-overview.component.html',
})
export class CourseOverviewComponent {
  @Input() completedCount = 0;
  @Input() inProgressCount = 0;
  @Input() totalCount = 0;

  // Calculate percentages for pie chart
  get completedPercentage(): number {
    return this.totalCount > 0 ? (this.completedCount / this.totalCount) * 100 : 0;
  }

  get inProgressPercentage(): number {
    return this.totalCount > 0 ? (this.inProgressCount / this.totalCount) * 100 : 0;
  }

  // SVG circle calculations for donut chart
  get completedStrokeDasharray(): string {
    const circumference = 2 * Math.PI * 60; // radius = 60
    const filled = (this.completedPercentage / 100) * circumference;
    return `${filled} ${circumference}`;
  }

  get inProgressStrokeDasharray(): string {
    const circumference = 2 * Math.PI * 60;
    const filled = (this.inProgressPercentage / 100) * circumference;
    return `${filled} ${circumference}`;
  }

  get inProgressStrokeOffset(): number {
    const circumference = 2 * Math.PI * 60;
    return -(this.completedPercentage / 100) * circumference;
  }
}
