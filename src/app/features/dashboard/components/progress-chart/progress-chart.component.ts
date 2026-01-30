import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html',
})
export class ProgressChartComponent implements OnChanges {
  @Input() period: 'week' | 'month' = 'week';
  @Input() data: any[] = [];

  chartData: ChartData[] = [];
  maxValue = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['period']) {
      this.prepareChartData();
    }
  }

  private prepareChartData(): void {
    // TODO: Transform data for display
    // For week: show days (Mon, Tue, Wed, etc.)
    // For month: show weeks (Week 1, Week 2, etc.)

    this.chartData = this.data.map((item) => ({
      label:
        this.period === 'week'
          ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
          : `Week ${Math.ceil(new Date(item.date).getDate() / 7)}`,
      value: item.hoursLearned || 0,
    }));

    this.maxValue = Math.max(...this.chartData.map((d) => d.value), 1);
  }

  getBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }
}
