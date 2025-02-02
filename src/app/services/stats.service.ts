import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getOpenSlotsCount(id: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/bookings/stats/open`, {
      params: { id },
      withCredentials: true,
    });
  }

  getBookedSlotsCount(id: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/bookings/stats/booked`, {
      params: { id },
      withCredentials: true,
    });
  }

  getTotalClientsCount(id: string): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/bookings/stats/totalClients`,
      { params: { id }, withCredentials: true }
    );
  }
}
