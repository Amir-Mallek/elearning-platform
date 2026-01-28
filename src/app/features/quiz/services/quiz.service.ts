import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Quiz, QuizAttempt, QuizResult, QuestionResult } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  // TODO: Inject HttpClient for real API calls
  // private http = inject(HttpClient);

  // TODO: Implement loadQuiz() - fetch quiz from API
  // Hint: return this.http.get<Quiz>(`/api/quizzes/${quizId}`);
  loadQuiz(quizId: string): Observable<Quiz> {
    // Mock data for development - replace with HTTP call
    const mockQuiz: Quiz = {
      id: '1',
      title: 'Angular Fundamentals Quiz',
      description: 'Test your knowledge of Angular basics',
      timeLimit: 30, // 10 minutes
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          text: 'What decorator is used to define a component in Angular?',
          options: [
            { id: 'a', text: '@NgModule' },
            { id: 'b', text: '@Component' },
            { id: 'c', text: '@Injectable' },
            { id: 'd', text: '@Directive' },
          ],
          correctAnswerId: 'b',
        },
        {
          id: 'q2',
          type: 'true-false',
          text: 'Angular uses two-way data binding by default.',
          options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
          ],
          correctAnswerId: 'false',
        },
        {
          id: 'q3',
          type: 'mcq',
          text: 'Which lifecycle hook is called after Angular initializes the component?',
          options: [
            { id: 'a', text: 'ngOnDestroy' },
            { id: 'b', text: 'ngOnChanges' },
            { id: 'c', text: 'ngOnInit' },
            { id: 'd', text: 'ngAfterViewInit' },
          ],
          correctAnswerId: 'c',
        },
        {
          id: 'q4',
          type: 'mcq',
          text: 'What is the purpose of the Angular CLI command "ng generate component"?',
          options: [
            { id: 'a', text: 'To create a new Angular project' },
            { id: 'b', text: 'To create a new component with boilerplate files' },
            { id: 'c', text: 'To build the application for production' },
            { id: 'd', text: 'To run unit tests' },
          ],
          correctAnswerId: 'b',
        },
        {
          id: 'q5',
          type: 'true-false',
          text: 'Signals in Angular are a reactive primitive introduced in Angular 16+.',
          options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
          ],
          correctAnswerId: 'true',
        },
      ],
    };
    return of(mockQuiz);
  }

  gradeQuiz(quiz: Quiz, answers: Map<string, string>): QuizResult {
    const questionResults: QuestionResult[] = quiz.questions.map((question) => {
      const selectedOptionId = answers.get(question.id) ?? null;
      const isCorrect = selectedOptionId === question.correctAnswerId;

      return {
        questionId: question.id,
        questionText: question.text,
        selectedOptionId,
        correctOptionId: question.correctAnswerId,
        isCorrect,
        options: question.options,
      };
    });

    const correctAnswers = questionResults.filter((qr) => qr.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers,
      score,
      questionResults,
    };
  }
}
