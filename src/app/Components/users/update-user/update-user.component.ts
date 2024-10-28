import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent {
  userForm: FormGroup;
  roles = ['user', 'admin', 'seller'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {
    this.userForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, Validators.required],
      isActive: [data.isActive],
      isVerified: [data.isVerified],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // نرسل فقط قيم النموذج بدون id
      this.dialogRef.close({
        _id: this.data.id, // نستخدم _id بدلاً من id للتعرف على المستخدم
        ...this.userForm.value,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
