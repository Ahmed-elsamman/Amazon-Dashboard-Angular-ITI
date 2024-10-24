import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Exclude requests to /login
    if (req.url.includes('/login')) {
      return next.handle(req);
    }

    // Add token to the headers for all other requests
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `${token}`),
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
