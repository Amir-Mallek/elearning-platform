import { Routes } from '@angular/router';
import {CourseDetailComponent} from './features/course-detail/course-detail';

export const routes: Routes = [
  {
    path: 'course-details/:courseId',
    component: CourseDetailComponent,
  },

];
