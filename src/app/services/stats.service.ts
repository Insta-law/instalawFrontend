import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly API_URL = `${environment.apiUrl}`;

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
