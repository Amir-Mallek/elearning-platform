import { Injectable } from '@angular/core';
import { Course } from '@models/course.model';
import mockCourses from '@assets/mock-courses.json';
import mockCourseItems from '@assets/mock-course-items.json';
import { CourseItem } from '@models/course-item.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Review } from '@models/review.model';
import { Lesson } from '@models/lesson.model';
import { CourseItemType } from '@enums/course-item-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly STORAGE_KEY = 'courses_data';

  private loadCourses(): Course[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...(mockCourses as Course[])];
  }

  private saveCourses(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.courses));
  }


  private courses: Course[] = this.loadCourses();
  private courseItems: CourseItem[] = [...(mockCourseItems as CourseItem[])];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseItems(courseId: string): Observable<CourseItem[]> {
    return of(mockCourseItems as CourseItem[]);
  }

  getLessonById(lessonId: string): Observable<Lesson | null> {
    const item = this.courseItems.find(
      (item) => item.id === lessonId && item.type === CourseItemType.LESSON,
    );

    if (!item) {
      return of(null).pipe(delay(200));
    }

    return of(item as Lesson).pipe(delay(200));
  }

  getCourseDetails(courseId: string): Observable<Course> {
    console.log('Getting course details for:', courseId);

    const course = this.courses.find((c) => c.id === courseId);
    console.log(course);

    if (!course) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

    return of(course).pipe(delay(500));
  }

  getAllCategories(): string[] {
    const categories = Array.from(new Set(this.courses.map((course) => course.category)));
    return categories;
  }

  getAllLevels(): string[] {
    const levels = Array.from(new Set(this.courses.filter(course => course.level !== "ALL_LEVELS").map((course) => course.level)));
    return levels;
  }

  updateCourseDetails(courseId: string, updatedData: Partial<Course>): Observable<Course> {
    const courseIndex = this.courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return throwError(() => new Error(`Course with ID ${courseId} not found`));
    }

   
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updatedData,
    };
    this.saveCourses();


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
    const reviewindex = course.reviews.findIndex(r => r.userId === review.userId);
    if (reviewindex !== -1) {
      course.reviews.splice(reviewindex, 1);
    }
    const updatedReviews: Review[] = [
      review,
      ...(course.reviews ?? []),
    ];

    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalRating / updatedReviews.length).toFixed(2));

    this.courses[courseIndex] = {
      ...course,
      reviews: updatedReviews,
      rating: averageRating,
      totalReviews: updatedReviews.length,
    };

    this.saveCourses();

    return of(this.courses[courseIndex]).pipe(delay(300));
  }


  updateEnrollment(courseId: string, isEnrolled: boolean): Observable<Course> {
    const courseIndex = this.courses.findIndex((c) => c.id === courseId);

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
    this.courses = [...(mockCourses as Course[])];
    console.log('Courses reset to original mock data');
  }
}
