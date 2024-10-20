import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthenServiceService } from 'src/app/Services/user-authen-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/aut-service.service';




// {with localstorge }


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isUserLogged: boolean=false;
  user:boolean = true

  constructor(private authService: AuthService,private Router: Router,private Toster:ToastrService) {
    Router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.user = this.authService.isUserLogged;

        if (this.user && val.url === '/login') {
          this.Router.navigate(['/dashboard']);
        } else if (!this.user && val.url !== '/login') {
        }
      }
    });
  }

  login(): void {
    this.authService.signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        // Handle successful login, maybe redirect or update UI
        this.Toster.success("Success", "Login Success")
        this.Router.navigate(['dashboard']);
      })
      .catch(error => {
        // Handle error, show error message
        console.error('Login error:', error);
      });
      this.isUserLogged=this.authService.isUserLogged
}
logout(): void {
  this.authService.signOut()
  .then(() => {
    // Handle successful logout, maybe redirect or update UI
  })
  .catch(error => {
    // Handle error, show error message
    console.error('Logout error:', error);
    });

    this.isUserLogged=this.authService.isUserLogged
}




ngOnInit(): void {
  this.isUserLogged=this.authService.isUserLogged
}
}
