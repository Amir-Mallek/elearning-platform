import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@models/course.model';
import { CourseService } from '@services/course.service';
import { CourseCardComponent } from '@components/course-card/course-card';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-catalog.html',
  styleUrls: ['./course-catalog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCatalogComponent {
  courses: Course[] = [];
  view: 'grid' | 'list' = 'grid';
  page = 1;
  pageSize = 3;

  constructor(private courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }

  //Pagination
  get totalPages(): number {
    return Math.ceil(this.courses.length / this.pageSize);
  }

  get pagedCourses(): Course[] {
    const start = (this.page - 1) * this.pageSize;
    return this.courses.slice(start, start + this.pageSize);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
  }

  get compactPages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.page;
    const delta = 1;
    const threshold = 7;
    const pages: (number | string)[] = [];

    if (total <= threshold) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let left = current - delta;
    let right = current + delta;

    if (left <= 2) {
      left = 2;
      right = left + delta * 2;
    }
    if (right >= total - 1) {
      right = total - 1;
      left = right - delta * 2;
    }

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  }
}
