import { CourseItem } from "./course-item.model";

export interface Lesson extends CourseItem {
  title: string;
  duration: number;
  text: string;
}