import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

// {
//   "_id": "670c4bff64b65b95934700de",
//   "name": "Ahmed sabry",
//   "email": "ahmedsabrihindawi@gmail.com",
//   "password": "$2a$10$dj3rczjsFbg215347/GYlOMMnio.OW6P6sdqmrMt/oRzPX9wrzV1O",
//   "role": "user",
//   "verificationToken": "10ff0e28a5b23e92f43086ceabda6dacfc78fa92fbdf86aa4907d35f9343bd51",
//   "isActive": true,
//   "isVerified": true,
//   "createdAt": "2024-10-13T22:38:57.332Z",
//   "updatedAt": "2024-10-13T22:38:57.332Z",
//   "__v": 0
// },
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  verificationToken: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // private readonly API_URL = `${environment.API_URL}/user`;
  private API_URL = `https://ahmed-sabry-ffbbe964.koyeb.app/user`;
  // private readonly token = localStorage.getItem('token');
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 302) {
      errorMessage =
        'The request was redirected. Please check the API endpoint or authentication settings.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(errorMessage);
  }
  constructor(private http: HttpClient) {
    console.log(this.API_URL);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map((response) => {
        // إذا كان الرد ناجحاً، نعيد البيانات مباشرة
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 302 && error.error && Array.isArray(error.error)) {
          // إذا كان الخطأ 302 والبيانات موجودة في error.error
          return of(error.error);
        }
        // إذا كان هناك خطأ آخر
        console.error('خطأ في جلب البيانات:', error);
        return throwError(() => error);
      })
    );
  }
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
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
