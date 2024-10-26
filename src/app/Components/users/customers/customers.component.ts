import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../../Services/users/users.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface UserDisplay {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'isActive',
    'isVerified',
    'createdAt',
  ];
  dataSource: MatTableDataSource<UserDisplay>;
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UsersService) {
    this.dataSource = new MatTableDataSource<UserDisplay>();
  }

  ngOnInit() {
    this.loadUsers();
    this.usersService
      .getUserById('67161562900521accf77f9b7')
      .subscribe((user) => {
        console.log('user By ID:>>>>>>>>>>>>>>>>>>>', user);
      });
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;

    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        console.log('users:>>>>>>>>>>>>>>>>>>>', users);
        this.isLoading = false;
        if (users && users.length > 0) {
          this.dataSource.data = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
            createdAt: new Date(user.createdAt).toLocaleDateString('ar-EG'),
          }));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('خطأ في الاشتراك:', error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
