import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  userForm: FormGroup;
  roles = ['user', 'admin', 'seller'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
      isActive: [true],
      isVerified: [true],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData: UserData = {
        ...this.userForm.value,
      };
      this.dialogRef.close(userData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
