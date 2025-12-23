import { CourseLevel } from '../enums/course-level.enum';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  rating: number;
  level: CourseLevel;
  durationInSeconds: number;
  lessonsCount: number;
  quizCount: number;
  category: string;
}
