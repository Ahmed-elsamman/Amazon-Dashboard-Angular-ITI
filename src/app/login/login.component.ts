import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/Auth/auth.service';

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
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((isAuth: boolean) => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.toastr.error('Please enter your email and password');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.toastr.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.toastr.error(error.error.message || 'Login failed');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  forgotPassword(): void {
    if (!this.email) {
      this.toastr.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.error('Please enter a valid email address and try again');
      return;
    }

    this.isLoading = true;
    this.authService.initiateAdminPasswordReset(this.email).subscribe({
      next: (response) => {
        console.log('Password reset response:', response);
        this.toastr.success(
          'Password reset instructions have been sent to your email'
        );
      },
      error: (error: any) => {
        console.error('Password reset error:', error);

        // تحسين رسائل الخطأ
        let errorMessage = 'Failed to process password reset request';

        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.status === 404) {
          errorMessage = 'Email not found in our records.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid email format or request.';
        }

        this.toastr.error(errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
