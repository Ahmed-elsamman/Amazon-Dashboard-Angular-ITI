// {connect with collection admin}





// {connect withauthfirebase}

// {with local storag and Guard}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedSubject: BehaviorSubject<boolean>;
   constructor(private afAuth: AngularFireAuth,private router: Router ) {
    this.isUserLoggedSubject = new BehaviorSubject<boolean>(false);
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential && userCredential.user) {
        localStorage.setItem('currentUser', JSON.stringify(userCredential.user));
        this.isUserLoggedSubject.next(true);


      }

    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  signOut(): Promise<void> {
    localStorage.removeItem('currentUser');
    this.isUserLoggedSubject.next(false);
    this.router.navigate(['/login']);

    return this.afAuth.signOut();
  }


  get isUserLogged():boolean
  {
return (localStorage.getItem('currentUser'))?true:false;


}


  isUserLoginS ():Observable<boolean>{
    return this.isUserLoggedSubject.asObservable();
  }
}
