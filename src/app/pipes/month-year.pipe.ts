import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYear',
})
export class MonthYearPipe implements PipeTransform {
  private readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  transform(value: Date): String {
    if (!value) {
      return '';
    }
    const month = this.months[value.getMonth()];
    const year = value.getFullYear();
    return `${month} ${year}`;
  }
}
