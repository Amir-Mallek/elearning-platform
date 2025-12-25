import { Routes } from '@angular/router';
import {CourseDetailComponent} from './features/course-detail/course-detail';
import { CourseCatalogComponent } from '@features/courses/pages/course-catalog/course-catalog';

export const routes: Routes = [
  {
    path: 'course-details/:courseId',
    component: CourseDetailComponent,
  },

    {
        path: 'courses',
        component: CourseCatalogComponent
    }
];
