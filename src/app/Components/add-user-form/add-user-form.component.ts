import { Component, Inject } from '@angular/core';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { Router } from '@angular/router';
import { IfirebaseUsers } from 'src/app/Models/ifirebase-users';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
})
export class AddUserFormComponent {
  userToAdd: IfirebaseUsers = {} as IfirebaseUsers;
  users: IfirebaseUsers[] = [];
  constructor(private fireBase: FirebasePrdService, private router: Router) {
    this.userToAdd = {
      id: '',
      createdAt: '',
      email: '',
      name: '',
    };
  }
  

  addUser(){
    this.fireBase.addUser(this.userToAdd);
    alert('User added successfully');
    this.router.navigate(['/users/users']);
  }
}
