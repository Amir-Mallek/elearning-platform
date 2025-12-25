export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'mcq' | 'true-false';
  text: string;
  options: Option[];
  correctAnswerId: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface QuizAttempt {
  quizId: string;
  answers: Map<string, string>; // questionId -> selectedOptionId
  startTime: Date;
  endTime?: Date;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  options: Option[];
}
