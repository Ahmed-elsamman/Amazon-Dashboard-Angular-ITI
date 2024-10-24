import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private readonly TOKEN_KEY = 'token';
  private readonly USER_INFO_KEY = 'userInfo';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<UserInfo | null>(null);
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      const userInfo = this.getUserInfoFromStorage();
      this.isAuthenticatedSubject.next(true);
      this.userDataSubject.next(userInfo);
      this.isLoggedIn.next(true);
    }
  }

  private getUserInfoFromStorage(): UserInfo | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }

  private setAuthData(response: AuthResponse): void {
    const userInfo: UserInfo = {
      email: response.email,
      userName: response.userName,
    };

    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));

    this.isAuthenticatedSubject.next(true);
    this.userDataSubject.next(userInfo);
    this.isLoggedIn.next(true);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.setAuthData(response);
          this.isLoggedIn.next(true);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);

    this.isAuthenticatedSubject.next(false);
    this.userDataSubject.next(null);
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userData$(): Observable<UserInfo | null> {
    return this.userDataSubject.asObservable();
  }
}
