import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/quiz.model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <!-- Question Type Badge -->
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          [class]="
            question().type === 'mcq' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
          "
        >
          {{ question().type === 'mcq' ? 'Multiple Choice' : 'True / False' }}
        </span>
      </div>

      <!-- Question Text -->
      <h2 class="text-lg md:text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
        {{ question().text }}
      </h2>

      <!-- Options -->
      <div class="space-y-3">
        <!-- TODO: Use @for control flow to iterate options -->
        <!-- Hint: @for (option of question().options; track option.id) -->
        @for (option of question().options; track option.id) {
        <button
          type="button"
          (click)="selectOption(option.id)"
          class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          [class]="
            selectedOptionId() === option.id
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 bg-white'
          "
        >
          <div class="flex items-center gap-4">
            <!-- Radio Circle -->
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              [class]="
                selectedOptionId() === option.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              "
            >
              @if (selectedOptionId() === option.id) {
              <div class="w-2 h-2 rounded-full bg-white"></div>
              }
            </div>
            <!-- Option Text -->
            <span
              class="text-base"
              [class]="
                selectedOptionId() === option.id ? 'text-blue-900 font-medium' : 'text-gray-700'
              "
            >
              {{ option.text }}
            </span>
          </div>
        </button>
        }
      </div>
    </div>
  `,
})
export class QuestionComponent {
  // TODO: Use signal inputs (Angular 17+)
  question = input.required<Question>();
  selectedOptionId = input<string | null>(null);

  // TODO: Use output() for event emission
  optionSelected = output<string>();

  selectOption(optionId: string): void {
    // Emit the selected option
    this.optionSelected.emit(optionId);
  }
}
