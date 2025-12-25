import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard',
  },
  {
    path: 'certificates',
    loadComponent: () =>
      import('./pages/certificates/certificates.component').then((m) => m.CertificatesComponent),
    title: 'My Certificates',
  },
  {
    path: 'activities',
    loadComponent: () =>
      import('./pages/activities/activities.component').then((m) => m.ActivitiesComponent),
    title: 'Activity History',
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./pages/progress/progress.component').then((m) => m.ProgressComponent),
    title: 'Learning Progress',
  },
];
