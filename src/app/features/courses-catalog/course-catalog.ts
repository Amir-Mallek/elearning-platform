import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@models/course.model';
import { CourseService } from '@services/course.service';
import { CourseCardComponent } from '@components/course-card/course-card';
import { SearchBar } from '@components/search-bar/search-bar';


type Level = 'beginner' | 'intermediate' | 'advanced';

type PriceMode = 'all' | 'free' | 'paid';

type DurationRange = 'all' | '0-2' | '2-6' | '6-12' | '12+';

type RatingMin = "all" | "1" | "2" | "3" | "4" | "4.5";

type CourseFilters = {
  category: string | 'all';
  level: Level | 'all';
  priceMode: PriceMode;
  duration: DurationRange;
  minRating: RatingMin;
};

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
  levelsList: string[] = [];
  categoriesList : string[] = [];

  view = signal<'grid' | 'list'>('grid');
  page = signal(1);
  pageSize = signal(6);

  searchQuery = signal('');




  filters = signal<CourseFilters>({
    category: 'all',
    level: 'all',
    priceMode: 'all',
    duration: 'all',
    minRating: "all",
  });


  constructor(private courseService: CourseService) {
    this.courses.set(this.courseService.getCourses());
    this.levelsList = this.courseService.getAllLevels();
    this.categoriesList = this.courseService.getAllCategories();

    effect(() => {
      this.searchQuery();
      this.filters();
      this.page.set(1);
    });
  }

  calculateDurationRange(hours: number): DurationRange {
    if (hours <= 2) return '0-2';
    if (hours <= 6) return '2-6';
    if (hours <= 12) return '6-12';
    return '12+';
  }

  setMinRating(value: string) {
    this.filters.update(f => ({
      ...f,
      minRating: (value) as RatingMin,
    }));
  }

  setDurationRange(value: string) {
    this.filters.update(f => ({
      ...f,
      duration: value as DurationRange,
    }));
  }
  setPriceMode(value: string) {
    this.filters.update(f => ({
      ...f,
      priceMode: value as PriceMode,
    }));
  }
  setCategory(value: string) {
    this.filters.update(f => ({
      ...f,
      category: value,
    }));
  }
  setLevel(value: string) {
    this.filters.update(f => ({
      ...f,
      level: value as Level | 'all',
    }));
  }


  //Filtering
  filteredCourses = computed(() => {
    const list = this.searchedCourses();
    const f = this.filters();

    return list.filter(course => {
      const price = course.price;
      const hours = course.durationInSeconds / 3600;
      const rating = course.rating.toString();
      const category = course.category.toLowerCase().trim();
      const level = course.level.toLowerCase().trim();

      const okCategory = f.category === 'all' ? true : category === f.category;
      const okLevel = f.level === 'all' ? true : (level === 'all_levels' ? true : level === f.level);
      const okPrice = (f.priceMode === 'all') ? true : (f.priceMode === 'free' ? price === 0 : price > 0);
      const okDuration = f.duration === 'all' ? true : (f.duration === this.calculateDurationRange(hours));
      const okRating = f.minRating === "all" ? true : Number(rating) >= Number(f.minRating);

      return okCategory && okLevel && okPrice && okDuration && okRating;
    });
  });

  showFilterPannel(){
    const filterPannel = document.getElementById('filter-pannel');
    if (filterPannel) {
      filterPannel.classList.toggle('hidden');
    }
  }



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
    const total = this.filteredCourses().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  pagedCourses = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    const list = this.filteredCourses();

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

  setPageSize(size: number): void {
    if(!size) return;
    this.pageSize.set(size);
    this.page.set(1); // Reset to first page when page size changes
  }
}
