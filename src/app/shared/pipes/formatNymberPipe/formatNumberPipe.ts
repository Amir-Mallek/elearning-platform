import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(num: number | null | undefined): string {
    if (num == null) {
      return '0';
    }

    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }

    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }

    return num.toString();
  }
}
