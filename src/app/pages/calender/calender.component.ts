import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'calender',
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
})
export class CalenderComponent implements OnInit {
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }

  ngOnInit(): void {}

  onDateChange(newDate: Date) {
    this.currentDate = newDate;
  }
}
