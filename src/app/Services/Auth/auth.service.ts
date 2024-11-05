import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  email: string;
  userName: string;
}

interface UserInfo {
  email: string;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.API_URL}/user`;
  private readonly ADMIN_TOKEN_KEY = 'admin_token';
  private readonly ADMIN_INFO_KEY = 'admin_info';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<UserInfo | null>(null);
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);
    console.log('Token:>>>>>>>>>>>>', token);
    if (token) {
      const userInfo = this.getUserInfoFromStorage();
      this.isAuthenticatedSubject.next(true);
      this.userDataSubject.next(userInfo);
      this.isLoggedIn.next(true);
    }
  }

  private getUserInfoFromStorage(): UserInfo | null {
    const userInfoStr = localStorage.getItem(this.ADMIN_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }

  private setAuthData(response: AuthResponse): void {
    const userInfo: UserInfo = {
      email: response.email,
      userName: response.userName,
    };

    localStorage.setItem(this.ADMIN_TOKEN_KEY, response.token);
    localStorage.setItem(this.ADMIN_INFO_KEY, JSON.stringify(userInfo));

    this.isAuthenticatedSubject.next(true);
    this.userDataSubject.next(userInfo);
    this.isLoggedIn.next(true);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/admin/login`, { email, password })
      .pipe(
        tap((response) => {
          this.setAuthData(response);
          this.isLoggedIn.next(true);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_INFO_KEY);

    this.isAuthenticatedSubject.next(false);
    this.userDataSubject.next(null);
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
  // إضافة دالة طلب إعادة تعيين كلمة المرور للمسؤول
  initiateAdminPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/initiate-password-reset`, {
      email,
    });
  }

  // إضافة دالة إعادة تعيين كلمة المرور للمسؤول
  adminResetPassword(token: string, newPassword: string): Observable<any> {
    return this.http
      .post(`${this.API_URL}/admin/reset-password`, {
        token,
        newPassword,
      })
      .pipe(
        tap((response) => console.log('Password reset response:', response)),
        catchError((error) => {
          console.error('Password reset error:', error);
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userData$(): Observable<UserInfo | null> {
    return this.userDataSubject.asObservable();
  }
}
