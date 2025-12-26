import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(description: string, length: number = 100): string | null {
    if (description === null || description === undefined) {
      return null;
    }
    if (description.length <= length) {
      return description;
    }
    const truncated = description.substr(0, length);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      return truncated.substr(0, lastSpaceIndex) + '...';
    }
    return truncated + '...';
  }

}
