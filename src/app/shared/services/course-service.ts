import { Injectable, model } from '@angular/core';
import { Course } from '@models/course.model';
import mockCourses from '@assets/mock-courses.json';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  getCourses(): Course[] {
    return mockCourses as Course[];
  }
}
