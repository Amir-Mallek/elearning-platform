import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@components/toast/toast.component';
import { Course } from './shared/models/course.model';
import { CourseLevel } from './shared/enums/course-level.enum';
import { CourseItemType } from './shared/enums/course-item-type.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('elearning');

}
