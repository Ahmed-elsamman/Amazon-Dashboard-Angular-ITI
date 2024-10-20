import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IfirebaseUsers } from 'src/app/Models/ifirebase-users';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.css']
})
export class UpdateUserFormComponent implements OnInit {
  editedUser: IfirebaseUsers;
  userToUpdate: IfirebaseUsers = {} as IfirebaseUsers;

  userForm: FormGroup;

  constructor(
    private firebase: FirebasePrdService,
    private router: Router,
    private dialogRef: MatDialogRef<UpdateUserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IfirebaseUsers },
    private fb: FormBuilder
  ) {
    this.editedUser = { ...data.user };
    this.userForm = this.fb.group({
      id: [''],
      createdAt: [''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.getUsers();
    const creationTime = new Date(this.data.user.createdAt);
    this.userForm.patchValue({
      ...this.data.user,
      createdAt: creationTime,
    });
  }

  getUsers(): void {
    this.firebase.getUsers().subscribe({
      next: (users: (DocumentData | (DocumentData & { id: string; }))[]) => {
        const mappedUsers: IfirebaseUsers[] = users.map((userData) => {
          if ('id' in userData) {
            const { id, ...rest } = userData;
            return { id: id, ...rest } as IfirebaseUsers;
          }
          return userData as IfirebaseUsers;
        });

        const userIdToUpdate = this.editedUser?.id;
        this.userToUpdate = mappedUsers.find(user => user.id === userIdToUpdate) || {} as IfirebaseUsers;
      },
      error: (err) => {
        console.log('Error fetching users:', err);
      },
      complete: () => {
        console.log('User fetching completed.');
      },
    });
  }

  updateUser(): void {
    if (this.userForm.valid) {
      const updatedUserData: IfirebaseUsers = this.userForm.value;
      this.firebase.updateUser(updatedUserData).then(
        (val: any) => {
          alert('User Updated Successfully');
          console.log('User Updated Successfully');
          this.dialogRef.close(updatedUserData);
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log('Form is invalid. Cannot update user.');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(updatedUserData: IfirebaseUsers): void {
    console.log('Updated User Data:', updatedUserData);
    this.dialogRef.close(updatedUserData);
  }
}
