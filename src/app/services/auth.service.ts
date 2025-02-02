import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly BASE_URL = 'http://localhost:8080';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.API_URL}/login`, null, {
        params: { email, password },
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.userSubject.next(user);
        })
      );
  }

  requestSignup(signupRequest: any): Observable<string> {
    return this.http.post<string>(
      `${this.API_URL}/requestSignup`,
      signupRequest,
      {
        withCredentials: true,
      }
    );
  }

  finalizeSignup(signupRequest: any, otp: string): Observable<any> {
    return this.http
      .post<any>(`${this.API_URL}/finaliseSignup`, signupRequest, {
        params: { otp },
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.userSubject.next(user);
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

  isAuthenticated(): Observable<string> {
    return this.http
      .get<string>(`${this.API_URL}/isAuthenticated`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
