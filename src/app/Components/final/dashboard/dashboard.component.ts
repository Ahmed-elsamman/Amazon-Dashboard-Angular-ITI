import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../Services/users/users.service';
import { OrdersService } from '../../../Services/orders.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';
import { OrderStatus } from 'src/app/Models/order.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
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
  ],
})
export class DashboardComponent implements OnInit {
  // Statistics
  newUsersCount = 0;
  activeUsersCount = 0;
  sellersCount = 0;
  pendingOrdersCount = 0;
  completedOrdersCount = 0;
  processingOrdersCount = 0;
  shippedOrdersCount = 0;
  cancelledOrdersCount = 0;

  // Charts Data
  usersPieData: any[] = [];
  ordersBarData: any[] = [];
  revenueLineData: any[] = [];

  // Chart Options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  timeline = true;

  // Custom color schemes
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadUsersData();
    this.loadOrdersData();
    this.generateRevenueData(); // Mock data for demonstration
  }

  private loadUsersData() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
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

        this.updateUsersPieChart();
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  private loadOrdersData() {
    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        this.pendingOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.PENDING
        ).length;
        this.shippedOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.SHIPPED
        ).length;
        this.completedOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.COMPLETED
        ).length;
        this.cancelledOrdersCount = orders.filter(
          (order) => order.orderStatus === OrderStatus.CANCELLED
        ).length;

        this.updateOrdersBarChart();
      },
      error: (error) => console.error('Error loading orders:', error),
    });
  }

  private updateUsersPieChart() {
    this.usersPieData = [
      { name: 'New Users', value: this.newUsersCount },
      { name: 'Active Users', value: this.activeUsersCount },
      { name: 'Sellers', value: this.sellersCount },
    ];
  }

  private updateOrdersBarChart() {
    this.ordersBarData = [
      { name: 'Pending', value: this.pendingOrdersCount },
      { name: 'Shipped', value: this.shippedOrdersCount },
      { name: 'Completed', value: this.completedOrdersCount },
      { name: 'Cancelled', value: this.cancelledOrdersCount },
    ];
  }

  private generateRevenueData() {
    // Mock data for revenue line chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    this.revenueLineData = [
      {
        name: 'Revenue',
        series: months.map((month) => ({
          name: month,
          value: Math.floor(Math.random() * 50000) + 10000,
        })),
      },
      {
        name: 'Profit',
        series: months.map((month) => ({
          name: month,
          value: Math.floor(Math.random() * 25000) + 5000,
        })),
      },
    ];
  }
}
