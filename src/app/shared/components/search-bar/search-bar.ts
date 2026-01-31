import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  value = input<string>('');
  valueChange = output<string>();

  onInput(value: string) {
    this.valueChange.emit(value);
  }

  clear() {
    this.valueChange.emit('');
  }
}
