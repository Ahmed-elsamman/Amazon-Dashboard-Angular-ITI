import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCard'
})
export class CreditCardPipe implements PipeTransform {

  transform(value: string):string {
    if (value && value.length == 16) {
      let formattedValue = '';

      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 == 0) {
          formattedValue += '-';
        }
        formattedValue += value[i];
      }
      return formattedValue;
    } else {
      return value;
    }
  }
}
