import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationPipe'
})
export class DurationPipe implements PipeTransform {

  transform(durationInSeconds: number): string | null {
    if (durationInSeconds === null || isNaN(durationInSeconds) || durationInSeconds < 0) {
      return null;
    }

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    // I want to have a format like "1h 30m", but only show non-zero units

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    return parts.length > 0 ? parts.join(' ') : null;
  }
}