import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@models/course.model';
import { DurationPipe } from '@pipes/DurationPipe/duration.pipe';
import { PricePipe } from '@pipes/PricePipe/price-pipe';
import { TruncatePipe } from '@pipes/TruncatePipe/truncate-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, DurationPipe, PricePipe, TruncatePipe],
  templateUrl: './course-card.html',
  styleUrls: ['./course-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  showBack = false;

  constructor(private router: Router) { }
  
  goToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }


  getThumb(course: any): string {
    const fallback = 'assets/course-default.png';
    if (!course?.thumbnail) return fallback;

    const sep = course.thumbnail.includes('?') ? '&' : '?';
    return `${course.thumbnail}${sep}auto=format&fit=crop&w=800&q=60`;
  }

  toggleDetails(e: MouseEvent) {
    e.stopPropagation();
    this.showBack = !this.showBack;
  }

  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;

    if (img.dataset['fallbackApplied'] === '1') return;
    img.dataset['fallbackApplied'] = '1';
    img.src = 'assets/course-default.png';
  }
}

