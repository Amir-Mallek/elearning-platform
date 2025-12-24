import { CourseItem } from "./course-item.model";

export interface Lesson extends CourseItem {
  id: string
  title: string;
  duration: number;
  text: string;
  isPreview: boolean
  isFree: boolean
}
