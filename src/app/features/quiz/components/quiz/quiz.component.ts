import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { QuestionComponent } from '../question/question.component';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuestionComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- Quiz Title -->
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ quiz()?.title ?? 'Loading...' }}
              </h1>
              <p class="text-sm text-gray-500">
                Question {{ currentQuestionIndex() + 1 }} of {{ quiz()?.questions?.length ?? 0 }}
              </p>
            </div>

            <!-- Timer -->
            <div
              class="flex items-center gap-2 px-4 py-2 rounded-lg"
              [class]="timerWarning() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="font-mono font-semibold">{{ formattedTime() }}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all duration-300 ease-out"
              [style.width.%]="progressPercentage()"
            ></div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 py-8">
        @if (currentQuestion(); as question) {
        <app-question
          [question]="question"
          [selectedOptionId]="getSelectedAnswer(question.id)"
          (optionSelected)="onOptionSelected(question.id, $event)"
        />
        } @else {
        <!-- Loading Skeleton -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-24 mb-6"></div>
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div class="space-y-3">
            <div class="h-14 bg-gray-100 rounded-lg"></div>
            <div class="h-14 bg-gray-100 rounded-lg"></div>
            <div class="h-14 bg-gray-100 rounded-lg"></div>
            <div class="h-14 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
        }

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-8">
          <button
            (click)="previousQuestion()"
            [disabled]="currentQuestionIndex() === 0"
            class="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          @if (isLastQuestion()) {
          <button
            (click)="submitQuiz()"
            class="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
          >
            Submit Quiz
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          } @else {
          <button
            (click)="nextQuestion()"
            class="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            Next
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          }
        </div>

        <!-- Question Navigation Dots -->
        <div class="flex flex-wrap justify-center gap-2 mt-8">
          @for (question of quiz()?.questions ?? []; track question.id; let i = $index) {
          <button
            (click)="goToQuestion(i)"
            class="w-10 h-10 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            [class]="getQuestionDotClasses(i, question.id)"
          >
            {{ i + 1 }}
          </button>
          }
        </div>
      </main>
    </div>
  `,
})
export class QuizComponent implements OnInit, OnDestroy {
  // Dependency Injection
  private quizService = inject(QuizService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // RxJS - Subject for cleanup
  private destroy$ = new Subject<void>();

  // Signals
  quiz = signal<Quiz | null>(null);
  currentQuestionIndex = signal(0);
  timeRemaining = signal(0);
  answers = signal<Map<string, string>>(new Map());

  // Computed Signals
  currentQuestion = computed(() => {
    const q = this.quiz();
    const idx = this.currentQuestionIndex();
    return q?.questions[idx] ?? null;
  });

  formattedTime = computed(() => {
    const time = this.timeRemaining();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  timerWarning = computed(() => this.timeRemaining() < 60);

  isLastQuestion = computed(() => {
    const q = this.quiz();
    return this.currentQuestionIndex() === (q?.questions?.length ?? 1) - 1;
  });

  progressPercentage = computed(() => {
    const q = this.quiz();
    if (!q) return 0;
    return ((this.currentQuestionIndex() + 1) / q.questions.length) * 100;
  });

  ngOnInit(): void {
    // Get quizId from route params and load quiz
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const quizId = params['quizId'] ?? '1';
      this.loadQuiz(quizId);
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuiz(quizId: string): void {
    this.quizService
      .loadQuiz(quizId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((quiz) => {
        this.quiz.set(quiz);
        this.timeRemaining.set(quiz.timeLimit);
        this.startTimer();
      });
  }

  startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeRemaining.update((t) => (t > 0 ? t - 1 : 0));
        if (this.timeRemaining() === 0) {
          this.submitQuiz();
        }
      });
  }

  onOptionSelected(questionId: string, optionId: string): void {
    this.answers.update((map) => new Map(map).set(questionId, optionId));
  }

  getSelectedAnswer(questionId: string): string | null {
    return this.answers().get(questionId) ?? null;
  }

  nextQuestion(): void {
    const q = this.quiz();
    if (q && this.currentQuestionIndex() < q.questions.length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex.set(index);
  }

  getQuestionDotClasses(index: number, questionId: string): string {
    const isCurrent = index === this.currentQuestionIndex();
    const isAnswered = this.answers().has(questionId);

    if (isCurrent) {
      return 'bg-blue-600 text-white ring-2 ring-blue-300';
    }
    if (isAnswered) {
      return 'bg-green-100 text-green-700 border-2 border-green-300';
    }
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }

  submitQuiz(): void {
    const q = this.quiz();
    if (!q) return;

    const result = this.quizService.gradeQuiz(q, this.answers());
    this.router.navigate(['/quiz', q.id, 'results'], {
      state: { result },
    });
  }
}
