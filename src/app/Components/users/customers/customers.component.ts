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
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;

    this.usersService
      .getAllUsers()
      .pipe(
        catchError((error) => {
          console.error('Error fetching users:', error);
          if (error.status === 401) {
            this.error = 'عذراً، يجب عليك تسجيل الدخول أولاً';
            // يمكنك هنا إضافة توجيه المستخدم إلى صفحة تسجيل الدخول
            // this.router.navigate(['/login']);
          } else {
            this.error = 'حدث خطأ أثناء تحميل البيانات';
          }
          return of([]); // إرجاع مصفوفة فارغة في حالة الخطأ
        })
      )
      .subscribe((users) => {
        this.isLoading = false;
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
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
