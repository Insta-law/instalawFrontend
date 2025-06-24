import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SignupResponse } from '../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly BASE_URL = `${environment.baseUrl}`;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.verifySession();
    }
  }
  verifySession() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        // First set the user from localStorage
        this.userSubject.next(JSON.parse(savedUser));
        this.isAuthenticated().subscribe({
          next: (isValid) => {
            if (!isValid) {
              // If backend says session is invalid, logout
              console.log('Session expired, logging out');
              this.handleLogout();
            }
          },
          error: () => {
            // On error, assume session is invalid
            console.log('Session verification failed, logging out');
            this.handleLogout();
          },
        });
      }
    }
  }
  private handleLogout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(`${this.API_URL}/login`, null, {
        params: { email, password },
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.isSuccess === true) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(response.userDetails));
            }
            this.userSubject.next(response.userDetails);
          }
        })
      );
  }

  requestSignup(signupRequest: any): Observable<string> {
    return this.http.post<string>(
      `${this.API_URL}/requestSignup`,
      signupRequest,
      {
        withCredentials: true,
        responseType: 'text' as 'json',
      }
    );
  }

  finalizeSignup(signupRequest: any, otp: string): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(`${this.API_URL}/finaliseSignup`, signupRequest, {
        params: { otp },
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.isSuccess === true) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(response.userDetails));
            }
            this.userSubject.next(response.userDetails);
          }
        })
      );
  }

  logout() {
    this.http
      .post(`${this.BASE_URL}/logout`, {}, { withCredentials: true })
      .pipe()
      .subscribe({
        next: () => this.handleLogoutSuccess(),
        error: () => this.handleLogoutSuccess(), // Still clear local state even if server call fails
      });
  }

  private handleLogoutSuccess(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  isAuthenticated(): Observable<Boolean> {
    return this.http
      .get<Boolean>(`${this.API_URL}/isAuthenticated`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
