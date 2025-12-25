import { Injectable, model } from '@angular/core';
import { Course } from '@models/course.model';
import mockCourses from '@assets/mock-courses.json';
import mockCoursesItems from '@assets/mock-course-items.json';
import { CourseItem } from '@models/course-item.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  getCourses(): Course[] {
    return mockCourses as Course[];
  }
  getCourseItems(courseId: string): CourseItem[] {
    return mockCoursesItems as CourseItem[];
  }
}
