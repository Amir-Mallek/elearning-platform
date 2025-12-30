import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activities-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4">Activity History (mock)</h2>
      <div *ngIf="activities().length === 0" class="text-gray-500">No activity yet</div>
      <ul class="space-y-4">
        <li *ngFor="let a of activities()" class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            {{ a.type.split('_')[0] | slice : 0 : 1 }}
          </div>
          <div>
            <div class="font-medium">{{ a.title }}</div>
            <div class="text-xs text-gray-500">
              {{ a.courseName || '' }} • {{ getTimeAgo(a.timestamp) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
})
export class ActivitiesComponent implements OnInit {
  private activityService = inject(ActivityService);
  activities = signal<Activity[]>([]);

  ngOnInit(): void {
    // load mocked activities
    this.activityService.getRecentActivities(50).subscribe((a) => this.activities.set(a));
  }

  getTimeAgo(date: Date): string {
    const now = Date.now();
    const diff = now - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}
