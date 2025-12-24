import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Course} from '../../shared/models/course.model';
import {DecimalPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../shared/services/course-service';
import {FormatUtils} from '../../shared/utils/format.utils';
import {FormsModule} from '@angular/forms';
import {Review} from '../../shared/models/review.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    FormsModule
  ],
  styleUrls: ['./course-detail.css']
})
  export class CourseDetailComponent  implements OnInit {


   course: Course | null = null;

  isEnrolled = false
  isFavorited = false
  expandedModules: Set<string> = new Set()
  formatUtils = FormatUtils
  selectedRating = 0;
  hoverRating = 0;
  reviewComment = '';
  constructor(private route: ActivatedRoute,private courseService: CourseService ,private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.course = this.courseService.getCourseDetails(this.route.snapshot.paramMap.get('courseId')!);
    this.cdr.detectChanges();

    // console.log('Course ID:', this.courseId);
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  submitReview() {
    if (!this.selectedRating) return;

    const newReview :Review = {
      id:"1",
      userId: 'user123',
      userName: 'You',
      userAvatar: '/assets/avatar.png',
      rating: this.selectedRating,
      comment: this.reviewComment,
      createdAt: (new Date()).toString()
    };

    this.course?.reviews.unshift(newReview);

    // reset
    this.selectedRating = 0;
    this.reviewComment = '';
  }




  toggleModule(moduleId: string): void {
    if (this.expandedModules.has(moduleId)) {
      this.expandedModules.delete(moduleId)
    } else {
      this.expandedModules.add(moduleId)
    }
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules.has(moduleId)
  }

  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited
  }

  handleEnrollment(): void {
    if (this.isEnrolled) {
      console.log("Navigating to course content...")
    } else {
      console.log("Processing enrollment...")
      this.isEnrolled = true
    }
  }

  shareContent(): void {
    console.log("Sharing course...")
  }

  getTotalDuration(): number {
    if (!this.course) return 0
    return this.course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
    }, 0)
  }

  getModuleDuration(moduleId: string): number {
    if (!this.course) return 0
    const module = this.course.modules.find((m) => m.id === moduleId)
    if (!module) return 0
    return module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
  }

  getRatingPercentage(stars: number): number {
    if (!this.course) return 0
    // Simulate rating distribution
    const distribution: { [key: number]: number } = {
      5: 75,
      4: 15,
      3: 6,
      2: 2,
      1: 2,
    }
    return distribution[stars] || 0
  }
}
