import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../Services/users/users.service';
import { OrdersService } from '../../../Services/orders.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import { IOrder, OrderStatus } from 'src/app/Models/order.model';
import { IUser } from 'src/app/Models/iuser';
import { UserDisplay } from 'src/app/Models/iuser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.4s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '0.3s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('orderPaginator') orderPaginator!: MatPaginator;
  @ViewChild('orderSort') orderSort!: MatSort;
  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;

  // Users Statistics
  newUsersCount = 0;
  activeUsersCount = 0;
  sellersCount = 0;
  userColumns = ['name', 'email', 'role', 'status', 'createdAt'];
  userDataSource: MatTableDataSource<any>;

  // Orders Statistics
  pendingOrdersCount = 0;
  completedOrdersCount = 0;
  processingOrdersCount = 0;
  cancelledOrdersCount = 0;
  orderColumns = [
    'orderNumber',
    'customer',
    'status',
    'totalPrice',
    'createdAt',
  ];
  orderDataSource: MatTableDataSource<IOrder>;

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService
  ) {
    this.orderDataSource = new MatTableDataSource<IOrder>();
    this.userDataSource = new MatTableDataSource<UserDisplay>();
  }

  ngOnInit(): void {
    this.loadUsersData();
    this.loadOrdersData();
  }

  ngAfterViewInit() {
    // تهيئة Paginator و Sort للمستخدمين
    this.userDataSource.paginator = this.userPaginator;
    this.userDataSource.sort = this.userSort;

    // تهيئة Paginator و Sort للطلبات
    this.orderDataSource.paginator = this.orderPaginator;
    this.orderDataSource.sort = this.orderSort;
  }

  private loadUsersData() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.userDataSource.data = this.transformUsers(users);
        const currentDate = new Date();
        const lastMonth = new Date(
          currentDate.setMonth(currentDate.getMonth() - 1)
        );

        this.newUsersCount = users.filter(
          (user) => new Date(user.createdAt) >= lastMonth
        ).length;
        this.activeUsersCount = users.filter((user) => user.isActive).length;
        this.sellersCount = users.filter(
          (user) => user.role === 'seller'
        ).length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
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
  private loadOrdersData() {
    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        this.orderDataSource.data = orders;

        this.pendingOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.PENDING
        ).length;
        this.processingOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.PROCESSING
        ).length;
        this.completedOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.COMPLETED
        ).length;
        this.cancelledOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.CANCELLED
        ).length;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      },
    });
  }

  getStatusClass(status: OrderStatus): string {
    const statusClasses = {
      [OrderStatus.PENDING]: 'pending',
      [OrderStatus.PROCESSING]: 'processing',
      [OrderStatus.COMPLETED]: 'completed',
      [OrderStatus.CANCELLED]: 'cancelled',
    };
    return statusClasses[status] || '';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
