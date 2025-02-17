import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Lawyer, SlotOpening } from '../models/data-entity.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getLawyerFromUserId(): Observable<Lawyer> {
    const userId = this.auth.getCurrentUser()?.id;

    return this.http
      .get<Lawyer>(`${this.API_URL}/lawyer/findByUserId`, {
        params: { userId },
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  openSlots(payload: SlotOpening): Observable<string> {
    return this.http
      .put<string>(`${this.API_URL}/slot/openBatch`, payload, {
        withCredentials: true,
        responseType: 'text' as 'json',
      })
      .pipe();
  }
}
