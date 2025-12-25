  import {CourseLevel} from '../enums/course-level.enum';
  import {Instructor} from './instructor.model';
import {Module} from './module.model';
import {Review} from './review.model';
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
    instructor: Instructor
    thumbnail: string
    enrolledCount: number
    language: string
    lastUpdated: string
    learningObjectives: string[]
    prerequisites: string[]
    modules: Module[]
    reviews: Review[]
    totalReviews: number
  }
