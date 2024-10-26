import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  return next(clonedRequest);
};
