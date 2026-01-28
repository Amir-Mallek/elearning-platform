import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Course} from './shared/models/course.model';
import {CourseLevel} from './shared/enums/course-level.enum';
import {CourseDetailComponent} from './features/course-detail/course-detail';
import {CourseItemType} from './shared/enums/course-item-type.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('elearning');
  course: Course = {
    id: "1",
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
    totalReviews: 250,
  };
}
