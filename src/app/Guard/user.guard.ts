import { CanActivateFn, Router } from '@angular/router';
// import { UserAuthenServiceService } from '../Services/user-authen-service.service';
import { inject } from '@angular/core';
import { AuthService } from '../Services/Auth/auth.service';
import { map, take } from 'rxjs/operators';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserLoggedIn$.pipe(
    take(1),
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return true;
      }

      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );
};
