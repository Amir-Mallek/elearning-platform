import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Lesson } from '../../shared/models/lesson.model';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../shared/services/course.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-lesson',
  imports: [CommonModule],
  templateUrl: './video-lesson.html',
  styleUrl: './video-lesson.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoLesson implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  lesson: Lesson | null = null;
  loading = true;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.cdr.markForCheck();
          const lessonId = params['lessonId'];
          console.log('VideoLesson: lessonId from route params:', lessonId);
          return this.courseService.getLessonById(lessonId);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (lesson) => {
          console.log('VideoLesson: lesson received:', lesson);
          this.lesson = lesson;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('VideoLesson: error loading lesson:', err);
          this.lesson = null;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
