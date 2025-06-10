import { Component, Input } from '@angular/core';

@Component({
  selector: 'calender-header',
  templateUrl: './calender-header.component.html',
  styleUrl: './calender-header.component.css',
})
export class CalenderHeaderComponent {
  @Input() currentDate: Date = new Date();
}
