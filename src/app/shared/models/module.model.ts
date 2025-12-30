import {Lesson} from './lesson.model';

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[] // Array of Lesson IDs
}
