import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../../Services/users/users.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddUserComponent } from '../add-user/add-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { ViewUserComponent } from '../view-user/view-user.component';
import { IUser, UserDisplay } from 'src/app/Models/iuser';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    AddUserComponent,
    UpdateUserComponent,
    ViewUserComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role',
    'isActive',
    'isVerified',
    'createdAt',
    'actions',
  ];
  dataSource: MatTableDataSource<UserDisplay>;
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<UserDisplay>();
  }

  ngOnInit() {
    this.loadUsers();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;

    this.usersService
      .getAllUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.dataSource.data = this.transformUsers(users);
        },
        error: (error) => {
          this.toastr.error('حدث خطأ في تحميل البيانات');
          console.error(error);
        },
      });
  }

  private transformUsers(users: IUser[]): UserDisplay[] {
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      updatedAt: new Date(user.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Add the remaining functions like viewUser, editUser, deleteUser
  viewUser(user: UserDisplay) {
    const dialogRef = this.dialog.open(ViewUserComponent, {
      width: '600px',
      data: user,
      panelClass: 'custom-dialog',
    });
  }
  editUser(user: UserDisplay) {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '500px',
      data: user,
      disableClose: true,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // نستخدم _id بدلاً من id
        const userId = result._id;
        delete result._id; // نحذف _id من البيانات المرسلة للتحديث

        this.usersService.updateUser(userId, result).subscribe({
          next: () => {
            this.toastr.success('Done Updating User Successfully');
            this.loadUsers();
          },
          error: (error) => {
            this.toastr.error('Error Updating User Try Again');
            console.error(error);
          },
        });
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('Done Deleting User Successfully');
          this.loadUsers();
        },
        error: (error) => {
          this.toastr.error('Error Deleting User');
          console.error(error);
        },
      });
    }
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // تنظيف البيانات قبل إرسالها
        const { _id, createdAt, updatedAt, ...cleanedData } = result;

        this.usersService.createUser(cleanedData).subscribe({
          next: () => {
            this.toastr.success('Done Adding User Successfully');
            this.loadUsers();
          },
          error: (error) => {
            this.toastr.error('Error Adding User Try Again');
            console.error(error);
          },
        });
      }
    });
  }
}
