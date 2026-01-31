import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@models/course.model';
import { CourseService } from '@services/course.service';
import { CourseCardComponent } from '@components/course-card/course-card';
import { SearchBar } from '@components/search-bar/search-bar';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, SearchBar],
  templateUrl: './course-catalog.html',
  styleUrls: ['./course-catalog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCatalogComponent {

  courses = signal<Course[]>([]);

  view = signal<'grid' | 'list'>('grid');
  page = signal(1);
  pageSize = signal(6);

  searchQuery = signal('');

  constructor(private courseService: CourseService) {
    this.courses.set(this.courseService.getCourses());
    effect(() => {
      this.searchQuery();
      this.page.set(1);
    });
  }

  //Filters
  filteredCourses = computed(() => {
    
    return this.courses();
  });

  //Search
  searchedCourses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.courses();

    if (!query) return all;

    return all.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  //Pagination
  totalPages = computed(() => {
    const total = this.searchedCourses().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  pagedCourses = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    const list = this.searchedCourses();

    const start = (p - 1) * size;
    return list.slice(start, start + size);
  });

  compactPages = computed<(number | string)[]>(() => {
    const total = this.totalPages();
    const current = this.page();
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

    if (left > 2) pages.push('...');

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < total - 1) pages.push('...');

    pages.push(total);

    return pages;
  });

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
  }
}
