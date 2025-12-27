import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseLevel } from '../enums/course-level.enum';
import { CourseItem } from '../models/course-item.model';
import { CourseItemType } from '../enums/course-item-type.enum';
import { Lesson } from '../models/lesson.model';
import { Quiz } from '../models/quiz.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  getCourseDetails(courseId: string): Observable<Course> {
    return of({
      id: courseId,
      title: 'Sample Course',
      description: 'This is a sample course description.',
      instructorId: 'instructor123',
      price: 49.99,
      rating: 4.5,
      level: CourseLevel.INTERMEDIATE,
      durationInSeconds: 3600,
      lessonsCount: 10,
      quizCount: 2,
      category: 'Programming',
      instructor: {
        id: 'instructor123',
        name: 'John Doe',
        bio: 'Experienced software developer and instructor.',
        title: 'Senior    Developer',
        avatar : 'path/to/instructor-avatar.jpg',
        coursesCount : 5,
        studentsCount : 2000,
        rating : 4.7
      },
      thumbnail: 'path/to/course-thumbnail.jpg',
      enrolledCount: 1200,
      language : 'English',
      lastUpdated: '2024-01-15',
      learningObjectives: [
        'Understand core programming concepts',
        'Build web applications',
        'Work with databases',
      ],
      prerequisites: [
        'Basic understanding of programming',
        'Familiarity with web technologies',
      ],
      modules: [{
        id: 'module-1',
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming.',
        lessons: [{
          id: 'lesson-1',
          title: 'What is Programming?',
          duration: 600,
          text:" In this lesson, we will explore the fundamentals of programming, including its definition, history, and importance in the modern world.",
          isFree: true,
          isPreview : true,
          courseId: "123",
          order: 1,
          type: CourseItemType.LESSON
        }],
      }],
      reviews: [],
      totalReviews: 251,
    })
  }

  getCourseItems(courseId: string): CourseItem[] {
    return [
      {
        id: 'lesson-1',
        courseId,
        order: 1,
        type: CourseItemType.LESSON,
        title: 'Introduction to the Course',
        duration: 10,
        text: 'Welcome! In this lesson we will cover the course objectives.',
      } as Lesson,

      {
        id: 'lesson-2',
        courseId,
        order: 2,
        type: CourseItemType.LESSON,
        title: 'Core Concepts',
        duration: 25,
        text: 'This lesson explains the core concepts you need to know.',
      } as Lesson,

      {
        id: 'quiz-1',
        courseId,
        order: 3,
        type: CourseItemType.QUIZ,
        questions: [],
        questionCount: 5,
      } as Quiz,

      {
        id: 'lesson-3',
        courseId,
        order: 4,
        type: CourseItemType.LESSON,
        title: 'Advanced Topics',
        duration: 30,
        text: 'We now dive into more advanced topics.',

      } as Lesson,

      {
        id: 'quiz-2',
        courseId,
        order: 5,
        type: CourseItemType.QUIZ,
        questions: [],
        questionCount: 10,
      } as Quiz,
    ];
  }
}
