import { Component, Input, OnInit } from '@angular/core';
import { calenderDay, EventPosition } from '../../../models/calender.model';

@Component({
  selector: 'calender-body',
  templateUrl: './calender-body.component.html',
  styleUrl: './calender-body.component.css',
})
export class CalenderBodyComponent implements OnInit {
  @Input() currentDate: Date = new Date();
  days: calenderDay[] = [];
  hours: string[] = [
    '0000',
    '0100',
    '0200',
    '0300',
    '0400',
    '0500',
    '0600',
    '0700',
    '0800',
    '0900',
    '1000',
    '1100',
    '1200',
    '1300',
    '1400',
    '1500',
    '1600',
    '1700',
    '1800',
    '1900',
    '2000',
    '2100',
    '2200',
    '2300',
  ];
  events:EventPosition[] = [];
  ngOnInit(): void {
    this.updateDays();
    this.calculateEventPositions();
  }

  updateDays() {
    this.days = [];
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.days.push({
        date: date,
        dayName: date.toLocaleString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate().toString(),
      });
    }
  }

  calculateEventPositions() {}
}
