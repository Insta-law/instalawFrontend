export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  location?: string;
}

export interface calenderDay {
  date: Date;
  dayName: string;
  dayNumber: string;
}

export interface calenderHour {
  hour: number;
  displayHour: string;
}

export interface EventPosition {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  day: number;
}
