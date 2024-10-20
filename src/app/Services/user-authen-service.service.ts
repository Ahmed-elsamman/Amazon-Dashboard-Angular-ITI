import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenServiceService {
  isUserLoggBehavior: BehaviorSubject<boolean>;
  constructor() {
    this.isUserLoggBehavior = new BehaviorSubject<boolean>(this.isUserLoggedInOrNot);
  }
  userLogin(email:string, password:string) {
    let token = "0123456";
    localStorage.setItem('accessToken', token);
    this.isUserLoggBehavior.next(true);
  }
  userLogout(){
    localStorage.removeItem('accessToken');
    this.isUserLoggBehavior.next(false);
  }
  get isUserLoggedInOrNot(): boolean {
    return  (localStorage.getItem('accessToken'))?true:false;
  }
  userStateChanged():Observable<boolean>{
    return this.isUserLoggBehavior.asObservable();
  }
}
