import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = `${environment.API_URL}/user`;
  private readonly token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  // getAllUsers(): Observable<User[]> {
  //   const headers = new HttpHeaders({
  //     Authorization: `${this.token}` || '',
  //     Accept: 'application/json',
  //   });

  //   const options = {
  //     headers: headers,
  //     withCredentials: true,
  //   };

  //   return this.http.get<User[]>(this.API_URL, options).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 302) {
  //         const redirectUrl = error.headers.get('Location');
  //         if (redirectUrl) {
  //           console.log('إعادة توجيه إلى:', redirectUrl);
  //           return this.http.get<User[]>(redirectUrl, options);
  //         }
  //       }
  //       // إذا كان التوكن غير صالح أو منتهي الصلاحية
  //       if (error.status === 401) {
  //         localStorage.removeItem('token');
  //         // يمكنك هنا إضافة منطق إعادة التوجيه إلى صفحة تسجيل الدخول
  //       }
  //       return throwError(() => {
  //         console.error('خطأ في جلب البيانات:', error);
  //         return error;
  //       });
  //     })
  //   );
  // }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL, {
      headers: new HttpHeaders({
        Authorization: `${this.token}` || 'on token here samman',
        Accept: 'application/json',
      }),
    });
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
