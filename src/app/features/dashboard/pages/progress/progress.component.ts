import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../services/progress.service';
import { ProgressChartComponent } from '../../components/progress-chart/progress-chart.component';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [CommonModule, ProgressChartComponent],
  template: `
    <div class="p-6 bg-white rounded-xl shadow">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Learning Progress (mock)</h2>
        <div>
          <button (click)="setPeriod('week')" [class.font-bold]="period() === 'week'" class="mr-2">
            Week
          </button>
          <button (click)="setPeriod('month')" [class.font-bold]="period() === 'month'">
            Month
          </button>
        </div>
      </div>

      <app-progress-chart [period]="period()" [data]="data()" />
    </div>
  `,
})
export class ProgressComponent implements OnInit {
  private progressService = inject(ProgressService);
  period = signal<'week' | 'month'>('week');
  data = signal<any[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.progressService.getLearningData(this.period()).subscribe((d) => this.data.set(d));
  }

  setPeriod(p: 'week' | 'month') {
    this.period.set(p);
    this.load();
  }
}
