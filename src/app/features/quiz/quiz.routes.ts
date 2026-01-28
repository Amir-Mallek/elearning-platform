import { Routes } from '@angular/router';

export const QUIZ_ROUTES: Routes = [
  {
    path: ':quizId',
    loadComponent: () => import('./components/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: ':quizId/results',
    loadComponent: () =>
      import('./components/quiz-results/quiz-results.component').then(
        (m) => m.QuizResultsComponent
      ),
  },
];
