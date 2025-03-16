import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../models/data-entity.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/bookings/user`, {
      params: { userId },
      withCredentials: true,
    });
  }
  cancelBooking(bookingId: string): Observable<any> {
    return this.http.put(`${this.API_URL}/bookings/cancel/${bookingId}`, null, {
      withCredentials: true,
      responseType: 'text' as 'json',
    });
  }
}
