import { Routes } from '@angular/router';
import { CourseDetailComponent } from './features/course-detail/course-detail';
import { CourseCatalogComponent } from '@features/courses/pages/course-catalog/course-catalog';
import { Learning } from '@features/learning/learning';
import { QUIZ_ROUTES } from '@features/quiz/quiz.routes';

export const routes: Routes = [
  // {
  //   path: 'course-details/:courseId',
  //   component: CourseDetailComponent,
  // },
  {
    path: 'courses',
    component: CourseCatalogComponent,
  },
  {
    path: 'courses/:courseId',
    component: CourseDetailComponent,
  },
  {
    path: 'courses/:courseId/learn',
    component: Learning,
    children: [...QUIZ_ROUTES],
  },
];
