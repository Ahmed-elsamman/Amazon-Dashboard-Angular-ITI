import {
  HttpInterceptorFn,
  HttpEvent,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { PlateformService } from '../Services/plateform/plateform.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const _plateformService: PlateformService = inject(PlateformService);
  const adminToken = localStorage.getItem('token');

  if (_plateformService.checkPlatform() && adminToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `${adminToken}`),
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // يمكنك هنا معالجة حالة انتهاء صلاحية التوكن
        // localStorage.removeItem('token');
        console.log('error:>>>>>>>>>>>>>>>>>>>', error);
        // يمكنك إعادة توجيه المستخدم لصفحة تسجيل الدخول
      }
      return throwError(() => error);
    })
  );
};
