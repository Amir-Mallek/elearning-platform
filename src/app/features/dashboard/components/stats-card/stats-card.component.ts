import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type IconType = 'book-open' | 'check-circle' | 'clock' | 'award' | 'trending-up';
type ColorType = 'blue' | 'green' | 'purple' | 'yellow' | 'orange';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
})
export class StatsCardComponent {
  @Input() icon!: IconType;
  @Input() value!: string | number;
  @Input() label!: string;
  @Input() color: ColorType = 'blue';
  @Input() trend?: { value: number; isPositive: boolean };

  getIconClasses(): string {
    const colorMap: Record<ColorType, string> = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      yellow: 'bg-yellow-100',
      orange: 'bg-orange-100',
    };
    return colorMap[this.color];
  }

  getIconColor(): string {
    const colorMap: Record<ColorType, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600',
      orange: 'text-orange-600',
    };
    return colorMap[this.color];
  }

  getIconSvg(): string {
    const icons: Record<IconType, string> = {
      'book-open':
        'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      award:
        'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    };
    return icons[this.icon];
  }
}
