import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from '../../shared/models/quiz.model';
import { Question } from '../../shared/models/question.model';

enum QuizState {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  GRADED = 'graded',
  SHOWING_ANSWERS = 'showing_answers',
}

interface QuestionAttempt {
  questionIndex: number;
  selectedAnswers: number[];
  isCorrect: boolean | null;
}

@Component({
  selector: 'app-quiz-content',
  imports: [],
  templateUrl: './quiz-content.html',
  styleUrl: './quiz-content.css',
})
export class QuizContent {
  @Input() quiz!: Quiz;
  @Output() quizCompleted = new EventEmitter<boolean>(); // emits true if passed
  @Output() nextItem = new EventEmitter<void>();

  quizState: QuizState = QuizState.NOT_STARTED;
  QuizState = QuizState; // expose enum to template

  attempts: QuestionAttempt[] = [];
  score: number = 0;
  totalQuestions: number = 0;

  ngOnInit(): void {
    this.totalQuestions = this.quiz.questions.length;
    this.initializeAttempts();
  }

  initializeAttempts(): void {
    this.attempts = this.quiz.questions.map((_, index) => ({
      questionIndex: index,
      selectedAnswers: [],
      isCorrect: null,
    }));
  }

  startQuiz(): void {
    this.quizState = QuizState.IN_PROGRESS;
    this.initializeAttempts();
    this.score = 0;
  }

  toggleAnswer(questionIndex: number, optionIndex: number): void {
    if (this.quizState !== QuizState.IN_PROGRESS) return;

    const attempt = this.attempts[questionIndex];
    const question = this.quiz.questions[questionIndex];

    // If single answer (requireAll false and only one correct answer)
    const isSingleAnswer = !question.requireAll && question.answer.length === 1;

    if (isSingleAnswer) {
      // Radio button behavior - replace selection
      attempt.selectedAnswers = [optionIndex];
    } else {
      // Checkbox behavior - toggle selection
      const index = attempt.selectedAnswers.indexOf(optionIndex);
      if (index > -1) {
        attempt.selectedAnswers.splice(index, 1);
      } else {
        attempt.selectedAnswers.push(optionIndex);
      }
    }
  }

  isAnswerSelected(questionIndex: number, optionIndex: number): boolean {
    return this.attempts[questionIndex].selectedAnswers.includes(optionIndex);
  }

  completenessPercentage(): number {
    const answeredCount = this.attempts.filter(
      (attempt) => attempt.selectedAnswers.length > 0
    ).length;
    return Math.round((answeredCount / this.totalQuestions) * 100);
  }

  gradeQuiz(): void {
    this.score = 0;

    this.attempts.forEach((attempt, index) => {
      const question = this.quiz.questions[index];
      const correctAnswers = question.answer.sort();
      const selectedAnswers = attempt.selectedAnswers.sort();

      // Check if answers match exactly
      const isCorrect =
        correctAnswers.length === selectedAnswers.length &&
        correctAnswers.every((val, idx) => val === selectedAnswers[idx]);

      attempt.isCorrect = isCorrect;
      if (isCorrect) {
        this.score++;
      }
    });

    this.quizState = QuizState.GRADED;

    // Emit completion if perfect score
    if (this.isPerfectScore()) {
      this.quizCompleted.emit(true);
    }
  }

  showAnswers(): void {
    this.quizState = QuizState.SHOWING_ANSWERS;
  }

  retakeQuiz(): void {
    this.startQuiz();
  }

  goToNextItem(): void {
    this.nextItem.emit();
  }

  isPerfectScore(): boolean {
    return this.score === this.totalQuestions;
  }

  get scorePercentage(): number {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  isCorrectAnswer(questionIndex: number, optionIndex: number): boolean {
    return this.quiz.questions[questionIndex].answer.includes(optionIndex);
  }

  getQuestionType(question: Question): string {
    if (question.answer.length === 1 && !question.requireAll) {
      return 'single';
    }
    return 'multiple';
  }

  canGrade(): boolean {
    // Check if all questions have at least one answer selected
    return this.attempts.every((attempt) => attempt.selectedAnswers.length > 0);
  }
}
