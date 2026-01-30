import { Routes } from '@angular/router';

export const QUIZ_ROUTES: Routes = [
  {
    path: 'quiz/:quizId',
    loadComponent: () => import('./components/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'quiz/:quizId/results',
    loadComponent: () =>
      import('./components/quiz-results/quiz-results.component').then(
        (m) => m.QuizResultsComponent,
      ),
  },
];
