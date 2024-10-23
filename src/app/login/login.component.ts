import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/aut-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isUserLogged: boolean = false;
  user: boolean = true;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.isUserLogged = this.authService.isUserLogged;
  }

  login(): void {
    this.authService
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.toastr.success('نجاح', 'تم تسجيل الدخول بنجاح');
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        console.error('خطأ في تسجيل الدخول:', error);
        this.toastr.error('فشل', 'فشل تسجيل الدخول');
      });
    this.isUserLogged = this.authService.isUserLogged;
  }

  logout(): void {
    this.authService
      .signOut()
      .then(() => {
        this.toastr.success('نجاح', 'تم تسجيل الخروج بنجاح');
        this.router.navigate(['login']);
      })
      .catch((error) => {
        console.error('خطأ في تسجيل الخروج:', error);
      });
    this.isUserLogged = this.authService.isUserLogged;
  }
}
