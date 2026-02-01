import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Level = 'beginner' | 'intermediate' | 'advanced';
export type PriceMode = 'all' | 'free' | 'paid';
export type DurationRange = 'all' | '0-2' | '2-6' | '6-12' | '12+';
export type RatingMin = 0 | 1 | 2 | 3 | 4 | 4.5;

export type CourseFilters = {
  category: string | 'all';
  level: Level | 'all';
  priceMode: PriceMode;
  duration: DurationRange;
  minRating: RatingMin;
};

export const DEFAULT_FILTERS: CourseFilters = {
  category: 'all',
  level: 'all',
  priceMode: 'all',
  duration: 'all',
  minRating: 0,
};

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.html',
  styleUrls: ['./filter-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  @Input({ required: true }) filters!: CourseFilters;

  @Input() categories: string[] = ['all'];

  @Input() resultsCount: number | null = null;

  @Output() filtersChange = new EventEmitter<CourseFilters>();

  levels: (Level | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

  update<K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) {
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }

  clear() {
    this.filtersChange.emit({ ...DEFAULT_FILTERS });
  }
}
