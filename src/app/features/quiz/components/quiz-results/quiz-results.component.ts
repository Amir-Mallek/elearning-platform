import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Score Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header -->
          <div
            class="px-8 py-10 text-center"
            [class]="
              result()?.score! >= 70
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            "
          >
            <div
              class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4"
            >
              @if (result()?.score! >= 70) {
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              } @else {
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              }
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ result()?.score! >= 70 ? 'Congratulations!' : 'Keep Learning!' }}
            </h1>
            <p class="text-white/90">You've completed the quiz</p>
          </div>

          <!-- Score Display -->
          <div class="px-8 py-8 text-center border-b border-gray-100">
            <div class="text-6xl font-bold text-gray-900 mb-2">{{ result()?.score ?? 0 }}%</div>
            <p class="text-gray-500">
              {{ result()?.correctAnswers ?? 0 }} out of {{ result()?.totalQuestions ?? 0 }} correct
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 divide-x divide-gray-100">
            <div class="px-4 py-6 text-center">
              <div class="text-2xl font-semibold text-gray-900">
                {{ result()?.totalQuestions ?? 0 }}
              </div>
              <div class="text-sm text-gray-500">Total</div>
            </div>
            <div class="px-4 py-6 text-center">
              <div class="text-2xl font-semibold text-green-600">
                {{ result()?.correctAnswers ?? 0 }}
              </div>
              <div class="text-sm text-gray-500">Correct</div>
            </div>
            <div class="px-4 py-6 text-center">
              <div class="text-2xl font-semibold text-red-600">
                {{ (result()?.totalQuestions ?? 0) - (result()?.correctAnswers ?? 0) }}
              </div>
              <div class="text-sm text-gray-500">Incorrect</div>
            </div>
          </div>
        </div>

        <!-- Review Section -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h2>

          <div class="space-y-4">
            @for (qr of result()?.questionResults ?? []; track qr.questionId; let i = $index) {
            <div
              class="bg-white rounded-xl border p-6"
              [class]="qr.isCorrect ? 'border-green-200' : 'border-red-200'"
            >
              <div class="flex items-start gap-4">
                <!-- Status Icon -->
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  [class]="qr.isCorrect ? 'bg-green-100' : 'bg-red-100'"
                >
                  @if (qr.isCorrect) {
                  <svg
                    class="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  } @else {
                  <svg
                    class="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  }
                </div>

                <div class="flex-1">
                  <p class="font-medium text-gray-900 mb-3">{{ i + 1 }}. {{ qr.questionText }}</p>

                  <!-- Options Review -->
                  <div class="space-y-2">
                    @for (option of qr.options; track option.id) {
                    <div
                      class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
                      [class]="getOptionClasses(option.id, qr)"
                    >
                      <span>{{ option.text }}</span>
                      @if (option.id === qr.correctOptionId) {
                      <span class="text-green-600 text-xs font-medium">(Correct)</span>
                      } @if (option.id === qr.selectedOptionId && !qr.isCorrect) {
                      <span class="text-red-600 text-xs font-medium">(Your answer)</span>
                      }
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            }
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <a
            routerLink="/courses"
            class="px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Back to Courses
          </a>
          <button
            (click)="retakeQuiz()"
            class="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  `,
})
export class QuizResultsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  result = signal<QuizResult | null>(null);
  quizId = signal<string>('1');

  ngOnInit(): void {
    // Get result from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { result: QuizResult } | undefined;

    if (state?.result) {
      this.result.set(state.result);
    } else {
      // Fallback: check history state (for page refresh scenarios)
      const historyState = history.state as { result: QuizResult } | undefined;
      if (historyState?.result) {
        this.result.set(historyState.result);
      }
    }

    // Get quizId from route
    this.route.params.subscribe((params) => {
      this.quizId.set(params['quizId'] ?? '1');
    });
  }

  getOptionClasses(optionId: string, qr: any): string {
    if (optionId === qr.correctOptionId) {
      return 'bg-green-50 border border-green-200 text-green-800';
    }
    if (optionId === qr.selectedOptionId && !qr.isCorrect) {
      return 'bg-red-50 border border-red-200 text-red-800';
    }
    return 'bg-gray-50 text-gray-600';
  }

  retakeQuiz(): void {
    this.router.navigate(['/quiz', this.quizId()]);
  }
}
