import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, map, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private API_URL = `${environment.API_URL}/user`;
  private usersRefreshSubject = new BehaviorSubject<boolean>(true);
  constructor(private http: HttpClient) {}

  usersRefresh$ = this.usersRefreshSubject.asObservable();
  refreshUsers() {
    this.usersRefreshSubject.next(true);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    // تأكد من إزالة الحقول غير المطلوبة
    const { _id, createdAt, updatedAt, ...cleanedData } = userData as any;

    return this.http
      .post<User>(`${this.API_URL}/admin/create`, cleanedData)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    // نتأكد من عدم وجود حقول غير مطلوبة
    const {
      _id,
      id: userId,
      createdAt,
      updatedAt,
      password,
      ...cleanedData
    } = userData as any;

    return this.http
      .patch<User>(`${this.API_URL}/admin/update/${id}`, cleanedData)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.API_URL}/admin/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Status Code: ${error.status}\nMessage: ${
        error.error?.message || error.message
      }`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
