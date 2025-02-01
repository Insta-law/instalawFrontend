import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getOpenSlotsCount(uuid: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/bookings/stats/open`, {
      params: { uuid },
    });
  }

  getBookedSlotsCount(uuid: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/bookings/stats/booked`, {
      params: { uuid },
    });
  }

  getTotalClientsCount(uuid: string): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/bookings/stats/totalClients`,
      { params: { uuid } }
    );
  }
}
