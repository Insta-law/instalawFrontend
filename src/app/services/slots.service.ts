import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlotsService {
  private readonly API_URL = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  getLawyerAvailability(lawyerId: string, date: string): Observable<string[]> {
    return this.http
      .get<any[]>(`${this.API_URL}/slot/availability`, {
        params: {
          lawyerId,
          date,
        },
        withCredentials: true,
      })
      .pipe(map((slots) => slots.map((slot) => slot.time)));
  }

  bookSlot(lawyerId: string, date: string, slotTime: string): Observable<any> {
    return this.http.put(`${this.API_URL}/bookings/book`, null, {
      params: {
        id: lawyerId,
        workingDate: date,
        slot: slotTime,
      },
      withCredentials: true,
      responseType: 'text' as 'json',
    });
  }
}
