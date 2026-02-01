import { Routes } from '@angular/router';
import { CourseDetailComponent } from '@features/course-detail/course-detail';
import { CourseCatalogComponent } from '@features/courses-catalog/course-catalog';
import { Learning } from '@features/learning/learning';
import { QUIZ_ROUTES } from '@features/quiz/quiz.routes';
import { VideoLesson } from '@features/video-lesson/video-lesson';
import { LoginComponent } from '@features/auth/login/login';
import { RegisterComponent } from '@features/auth/register/register';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authChildGuard } from '@features/auth/guards/auth.guard';
import { ProfileComponent } from '@features/user/profile/profile';
import { EditProfileComponent } from '@features/user/edit-profile/edit-profile';
import { ChangePasswordComponent } from '@features/user/change-password/change-password';
import { SettingsComponent } from '@features/user/settings/settings';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
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
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'profile/edit',
        component: EditProfileComponent,
      },
      {
        path: 'profile/password',
        component: ChangePasswordComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
