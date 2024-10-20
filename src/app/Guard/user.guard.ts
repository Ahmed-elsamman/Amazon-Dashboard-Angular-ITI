import { CanActivateFn, Router } from '@angular/router';
// import { UserAuthenServiceService } from '../Services/user-authen-service.service';
import { inject } from '@angular/core';
import { AuthService } from '../Services/aut-service.service';

export const userGuard: CanActivateFn = (route, state) => {
  const userService= inject(AuthService);
  const router = inject(Router);
  if (userService.isUserLogged) {
    return true;

  } else{

    alert("Please return to Login");
   router.navigate(['/login']);
    return false;
  }

  };
