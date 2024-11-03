import { ProductsService } from './../../../Services/products-services.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';
import { OrderStatus } from 'src/app/Models/order.model';
import { UsersService } from 'src/app/Services/users/users.service';
import { OrdersService } from 'src/app/Services/orders.service';

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
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  // Statistics
  statistics = {
    users: {
      new: 0,
      active: 0,
      verified: 0,
      sellers: 0,
    },
    orders: {
      pending: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    },
  };

  // Chart Options
  chartOptions = {
    view: undefined as any, // سيتم تحديثه تلقائياً
    showXAxis: true,
    showYAxis: true,
    gradient: true,
    showLegend: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    timeline: true,
    autoScale: true,
    roundDomains: true,
    animations: true,
    legendPosition: 'right',
    responsive: true,
  };
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  // Chart Data
  usersPieData: any[] = [];
  ordersBarData: any[] = [];
  revenueLineData: any[] = [];
  categoriesChartData: any[] = [];
  totalProducts: number = 0;

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }
  // إضافة دالة لتحديث حجم المخططات
  @HostListener('window:resize')
  onResize() {
    this.updateChartDimensions();
  }

  private updateChartDimensions() {
    const chartElements = document.querySelectorAll('.chart-card');
    chartElements.forEach((element) => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      this.chartOptions.view = [width, height];
    });
  }
  ngAfterViewInit() {
    this.updateChartDimensions();
  }

  private async loadDashboardData() {
    try {
      await Promise.all([
        this.loadUsersData(),
        this.loadOrdersData(),
        this.generateRevenueData(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private async loadUsersData() {
    const users = await this.usersService.getAllUsers().toPromise();
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );

    this.statistics.users = {
      new:
        users?.filter((user) => new Date(user.createdAt) >= lastMonth).length ||
        0,
      active: users?.filter((user) => user.isActive).length || 0,
      verified: users?.filter((user) => user.isVerified).length || 0,
      sellers: users?.filter((user) => user.role === 'seller').length || 0,
    };

    this.updateUsersPieChart();
  }

  private async loadOrdersData() {
    const orders = await this.ordersService.getUserOrders().toPromise();

    this.statistics.orders = {
      pending:
        orders?.filter((order) => order.orderStatus === OrderStatus.PENDING)
          .length || 0,
      shipped:
        orders?.filter((order) => order.orderStatus === OrderStatus.SHIPPED)
          .length || 0,
      completed:
        orders?.filter((order) => order.orderStatus === OrderStatus.COMPLETED)
          .length || 0,
      cancelled:
        orders?.filter((order) => order.orderStatus === OrderStatus.CANCELLED)
          .length || 0,
    };

    this.updateOrdersBarChart();
  }

  private updateUsersPieChart() {
    this.usersPieData = [
      { name: 'New Users', value: this.statistics.users.new },
      { name: 'Active Users', value: this.statistics.users.active },
      { name: 'Verified Users', value: this.statistics.users.verified },
      { name: 'Sellers', value: this.statistics.users.sellers },
    ];
  }

  private updateOrdersBarChart() {
    this.ordersBarData = [
      { name: 'Pending', value: this.statistics.orders.pending },
      { name: 'Shipped', value: this.statistics.orders.shipped },
      { name: 'Completed', value: this.statistics.orders.completed },
      { name: 'Cancelled', value: this.statistics.orders.cancelled },
    ];
  }

  private generateRevenueData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    this.revenueLineData = [
      {
        name: 'Revenue',
        series: months.map((month) => ({
          name: month,
          value: Math.floor(Math.random() * 50000) + 10000,
        })),
      },
    ];
  }

  calculatePercentage(value: number): number {
    const total = this.usersPieData.reduce((sum, item) => sum + item.value, 0);
    return Math.round((value / total) * 100);
  }

  calculateProductPercentage(value: number): number {
    if (!this.totalProducts) return 0;
    return Math.round((value / this.totalProducts) * 100);
  }
}
