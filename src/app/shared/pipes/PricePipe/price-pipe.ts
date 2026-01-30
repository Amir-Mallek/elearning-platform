import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(price : number | null): string | null {
    if ( price === null || isNaN(price) || price < 0) {
      return null;
    }
    if (price === 0) {
      return 'Free';
    }
    return `$${price.toFixed(2)}`;
  }

}
