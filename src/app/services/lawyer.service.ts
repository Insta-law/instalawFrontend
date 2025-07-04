import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Lawyer, SlotOpening } from '../models/data-entity.model';
import { Observable, tap } from 'rxjs';
import { LawyerSearch } from '../models/search.model';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  private readonly API_URL = `${environment.apiUrl}`;

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

  getAllLawyers(): Observable<LawyerSearch[]> {
    return this.http.get<LawyerSearch[]>(`${this.API_URL}/lawyer/all`, {
      withCredentials: true,
    });
  }

  getLawyerById(lawyerId: string): Observable<Lawyer> {
    return this.http.get<Lawyer>(`${this.API_URL}/lawyer/${lawyerId}`, {
      withCredentials: true,
    });
  }
}
