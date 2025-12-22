export interface Question {
  text: string;
  options: string[];
  answer: number[];
  requireAll: boolean;
}