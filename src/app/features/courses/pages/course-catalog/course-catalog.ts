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

  constructor(private courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }
}
