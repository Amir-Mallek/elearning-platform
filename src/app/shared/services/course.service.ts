import { Injectable } from '@angular/core';
import { Course } from '@models/course.model';
import mockCourses from '@assets/mock-courses.json';
import mockCourseItems from '@assets/mock-course-items.json';
import { CourseItem } from '@models/course-item.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Review } from '@models/review.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // ✅ This is your single source of truth - all changes happen here
  private courses: Course[] = [...mockCourses as Course[]];

  getCourses(): Course[] {
    return this.courses;  // ✅ Changed from mockCourses
  }


  getCourseItems(courseId: string): CourseItem[] {
    return mockCourseItems as CourseItem[];
  }


  getCourseDetails(courseId: string): Observable<Course> {
    console.log("Getting course details for:", courseId);

    const course = this.courses.find(c => c.id === courseId);  // ✅ Changed from mockCourses

    if (!course) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

    return of(course).pipe(delay(500));
  }


  updateCourseDetails(courseId: string, updatedData: Partial<Course>): Observable<Course> {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

    // Immutable update - create new object
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updatedData,
    };

    return of(this.courses[courseIndex]).pipe(delay(300));
  }


  addReview(courseId: string | undefined, review: Review): Observable<Course> {
    if (!courseId) {
      return throwError(() => new Error('Course ID is required'));
    }

    const courseIndex = this.courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

    const course = this.courses[courseIndex];

    // Add review to the beginning of reviews array
    const updatedReviews = [review, ...course.reviews];

    // Recalculate rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalRating / updatedReviews.length).toFixed(2));

    // Update course immutably
    this.courses[courseIndex] = {
      ...course,
      reviews: updatedReviews,
      rating: averageRating,
      totalReviews: updatedReviews.length,
    };

    return of(this.courses[courseIndex]).pipe(delay(300));
  }


  updateEnrollment(courseId: string, isEnrolled: boolean): Observable<Course> {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

    const course = this.courses[courseIndex];

    // Update enrollment count
    const enrolledCount = isEnrolled
      ? course.enrolledCount + 1
      : Math.max(0, course.enrolledCount - 1);

    this.courses[courseIndex] = {
      ...course,
      enrolledCount,
    };

    return of(this.courses[courseIndex]).pipe(delay(300));
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(courseId: string, isFavorited: boolean): Observable<boolean> {
    // In a real app, this would save to backend
    // For now, just simulate the operation
    console.log(`Course ${courseId} favorite status: ${isFavorited}`);
    return of(isFavorited).pipe(delay(200));
  }

  /**
   * Reset all courses to original mock data
   * Useful for testing or resetting the app
   */
  resetCourses(): void {
    this.courses = [...mockCourses as Course[]];
    console.log('Courses reset to original mock data');
  }
}
