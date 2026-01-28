import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of } from 'rxjs';
import { Enrollment } from '@models/enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  // In-memory storage for enrollments (simulates backend)
  private enrollments = new BehaviorSubject<Map<string, Enrollment>>(
    new Map([
      [
        'course-1',
        {
          userId: 'user-1',
          courseId: 'course-1',
          lastCompleted: -1, // -1 means no items completed
          enrolledAt: new Date(),
        },
      ],
    ]),
  );

  enrollInCourse(
    userId: string,
    courseId: string | undefined,
  ): Observable<{ success: boolean; message: string }> {
    console.log(`Enrolling in course with ID: ${courseId}`);
    // Simulate an API call with a delay
    return of({
      success: true,
      message: `Successfully enrolled in course ${courseId}`,
    }).pipe(delay(500));
  }

  /**
   * Get enrollment for a specific course
   * Returns mock enrollment with lastCompleted index
   */
  getEnrollment(courseId: string): Observable<Enrollment> {
    return this.enrollments.pipe(
      map((enrollmentMap) => {
        const existing = enrollmentMap.get(courseId);
        if (existing) {
          return existing;
        }
        // Return default enrollment if not found
        return {
          userId: 'user-1',
          courseId: courseId,
          lastCompleted: -1,
          enrolledAt: new Date(),
        };
      }),
    );
  }

  /**
   * Update the last completed item index for a course
   * Only updates if new index is greater than current (can only progress forward)
   */
  updateLastCompleted(courseId: string, itemIndex: number): Observable<Enrollment> {
    const currentMap = this.enrollments.getValue();
    const existing = currentMap.get(courseId);

    const updatedEnrollment: Enrollment = {
      userId: existing?.userId || 'user-1',
      courseId: courseId,
      lastCompleted: Math.max(existing?.lastCompleted ?? -1, itemIndex),
      enrolledAt: existing?.enrolledAt || new Date(),
    };

    const newMap = new Map(currentMap);
    newMap.set(courseId, updatedEnrollment);
    this.enrollments.next(newMap);

    return of(updatedEnrollment).pipe(delay(200));
  }

  /**
   * Check if a specific item index is completed
   */
  isItemCompleted(courseId: string, itemIndex: number): Observable<boolean> {
    return this.getEnrollment(courseId).pipe(
      map((enrollment) => itemIndex <= enrollment.lastCompleted),
    );
  }

  /**
   * Calculate progress percentage
   */
  getProgressPercentage(courseId: string, totalItems: number): Observable<number> {
    return this.getEnrollment(courseId).pipe(
      map((enrollment) => {
        if (totalItems === 0) return 0;
        const completedCount = enrollment.lastCompleted + 1;
        return Math.round((completedCount / totalItems) * 100);
      }),
    );
  }
}
