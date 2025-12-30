import { Routes } from '@angular/router';
import { CourseDetailComponent } from './features/course-detail/course-detail';
import { CourseCatalogComponent } from '@features/courses/pages/course-catalog/course-catalog';
import { Learning } from '@features/learning/learning';

export const routes: Routes = [
  {
    path: 'courses',
    component: CourseCatalogComponent,
  },
  {
    path: 'quiz',
    loadChildren: () => import('@features/quiz/quiz.routes').then((m) => m.QUIZ_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'course-details/:courseId',
    component: CourseDetailComponent,
  },

  {
    path: 'courses',
    component: CourseCatalogComponent,
  },
  {
    path: 'learning',
    component: Learning,
  },
];
