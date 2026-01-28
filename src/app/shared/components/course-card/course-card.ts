import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@models/course.model';
import { DurationPipe } from '@pipes/DurationPipe/duration.pipe';
import { PricePipe } from '@pipes/PricePipe/price-pipe';
import { TruncatePipe } from '@pipes/TruncatePipe/truncate-pipe';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, DurationPipe, PricePipe, TruncatePipe],
  templateUrl: './course-card.html',
  styleUrls: ['./course-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  @Input() course!: Course ;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  showBack = false;

  toggleDetails(): void {
    this.showBack = !this.showBack;
  }
}
