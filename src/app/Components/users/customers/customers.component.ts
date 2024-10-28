import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
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
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    NgxChartsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit, AfterViewInit {
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

  usersByRoleData: any[] = [];
  usersByStatusData: any[] = [];
  usersByMonthData: any[] = [];

  colorScheme: any = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  chartWidth = Math.min(window.innerWidth - 100, 1200); // تحديد حد أقصى للعرض

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<UserDisplay>();
  }

  @HostListener('window:resize')
  onResize() {
    this.chartWidth = Math.min(window.innerWidth - 100, 1200);
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadUsers() {
    this.isLoading = true;
    this.error = null;

    this.usersService
      .getAllUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.dataSource.data = this.transformUsers(users);
          this.updateCharts(users);
        },
        error: (error) => {
          this.toastr.error('حدث خطأ في تحميل البيانات');
          console.error(error);
        },
      });
  }

  private updateCharts(users: IUser[]) {
    // تحديث بيانات المخطط الدائري حسب الأدوار
    const roleCount = this.countByProperty(users, 'role');
    this.usersByRoleData = Object.entries(roleCount).map(([name, value]) => ({
      name,
      value,
    }));

    // تحديث بيانات المخطط العمودي حسب الحالة
    this.usersByStatusData = [
      {
        name: 'Active',
        value: users.filter((user) => user.isActive).length,
      },
      {
        name: 'Inactive',
        value: users.filter((user) => !user.isActive).length,
      },
      {
        name: 'Verified',
        value: users.filter((user) => user.isVerified).length,
      },
    ];

    // تحديث بيانات المخطط الخطي حسب الشهر
    const monthlyData = this.getUsersByMonth(users);
    this.usersByMonthData = [
      {
        name: 'New Users',
        series: monthlyData,
      },
    ];
  }

  private countByProperty(array: any[], property: string) {
    return array.reduce((acc, curr) => {
      const key = curr[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  private getUsersByMonth(users: IUser[]) {
    const months = [
      'Ja n',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyCount = new Array(12).fill(0);

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();
      monthlyCount[month]++;
    });

    return months.map((month, index) => ({
      name: month,
      value: monthlyCount[index],
    }));
  }

  transformUsers(users: IUser[]): UserDisplay[] {
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

  onSelect(event: any) {
    console.log(event);
  }
}
