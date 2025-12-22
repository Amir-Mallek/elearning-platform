import { CourseItem } from "./course-item.model";
import { Question } from "./question.model";

export interface Quiz extends CourseItem {
  questions: Question[];
  questionCount: number;
}