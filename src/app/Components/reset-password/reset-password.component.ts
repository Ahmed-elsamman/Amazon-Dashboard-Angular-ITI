import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];

      if (!this.token) {
        this.toastr.error('Invalid reset password link');
        this.router.navigate(['/login']);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.isLoading = true;
      const newPassword = this.resetForm.get('password')?.value;

      this.authService.adminResetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          console.log('Reset password response:', response);
          this.toastr.success('Password has been reset successfully');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Reset password error:', error);
          let errorMessage = 'Failed to reset password';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 404) {
            errorMessage = 'Invalid reset link or token';
          } else if (error.status === 400) {
            errorMessage = 'Invalid password format';
          }

          this.toastr.error(errorMessage);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly');
    }
  }
}
