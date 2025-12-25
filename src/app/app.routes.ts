import { Routes } from '@angular/router';
import { CourseCatalogComponent } from '@features/courses/pages/course-catalog/course-catalog';

export const routes: Routes = [
  {
    path: 'courses',
    component: CourseCatalogComponent,
  },
  {
    path: 'quiz',
    loadChildren: () => import('@features/quiz/quiz.routes').then((m) => m.QUIZ_ROUTES),
  },
];
