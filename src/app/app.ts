import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Course } from './shared/models/course.model';
import { CourseLevel } from './shared/enums/course-level.enum';
import { Learning } from './features/learning/learning';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Learning],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('elearning');
  course: Course = {
    id: 'course1',
    instructorId: 'instructor1',
    price: 19.99,
    rating: 4.5,
    durationInSeconds: 3600,
    level: CourseLevel.ADVANCED,
    category: 'programming',
    lessonsCount: 10,
    quizCount: 2,
    title: 'Sample Course',
    description: 'This is a sample course description.',
  };
}
