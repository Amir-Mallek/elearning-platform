import { Injectable } from '@angular/core';
import { Course } from '@models/course.model';

import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {

  enrollInCourse(userId: string, courseId: string | undefined): Observable<{ success: boolean; message: string }> {
    console.log(`Enrolling in course with ID: ${courseId}`);
    // Simulate an API call with a delay
    return of({ success: true, message: `Successfully enrolled in course ${courseId}` }).pipe(delay(500));
  }
}
