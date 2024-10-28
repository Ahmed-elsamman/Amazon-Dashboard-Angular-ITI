import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');

  // Exclude requests to /login
  if (req.url.includes('/login')) {
    return next(req);
  }

  // Add token to the headers for all other requests
  const clonedRequest = token
    ? req.clone({
        headers: req.headers.set('Authorization', `${token}`),
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 302 && error.error && Array.isArray(error.error)) {
        // تحويل البيانات إلى HttpResponse
        return of(
          new HttpResponse({
            body: error.error,
            status: 200,
            statusText: 'OK',
          })
        );
      }
      return throwError(() => error);
    })
  );
};
