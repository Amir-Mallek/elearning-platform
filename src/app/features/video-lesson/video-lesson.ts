import { Component, Input } from '@angular/core';
import { Lesson } from '../../shared/models/lesson.model';

@Component({
  selector: 'app-video-lesson',
  imports: [],
  templateUrl: './video-lesson.html',
  styleUrl: './video-lesson.css',
})
export class VideoLesson {
  @Input() lesson: Lesson | null = null;
}
