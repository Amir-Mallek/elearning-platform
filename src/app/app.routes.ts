import { Routes } from '@angular/router';
import {  CourseDetailComponent  } from './features/course-detail/course-detail';
import { CourseCatalogComponent } from '@features/courses/pages/course-catalog/course-catalog';
import {  Learning  } from '@features/learning/learning';
import { QUIZ_ROUTES } from '@features/quiz/quiz.routes';
import { VideoLesson } from '@features/video-lesson/video-lesson';

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
    children: [
      ...QUIZ_ROUTES,
      {
        path: 'lesson/:lessonId',
        component: VideoLesson,
      },
    ],
  },
];

  {
    path: 'courses',
    component: CourseCatalogComponent,
  },
  {
    path: 'learning',
    component: Learning,
  },
];
