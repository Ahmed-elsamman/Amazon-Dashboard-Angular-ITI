import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../Services/users/users.service';
import { OrdersService } from '../../../Services/orders.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';
import { OrderStatus } from 'src/app/Models/order.model';
import {
  ProductsServicesService,
  Product,
} from '../../../Services/products-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  // Statistics
  newUsersCount = 0;
  activeUsersCount = 0;
  isVerifiedUsersCount = 0;
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

  // Categories Data
  categoriesData: any[] = [];
  totalProducts = 232417; // مجموع كل المنتجات

  categoriesChartData: any[] = [];

  products: Product[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  searchTerm = '';

  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'stock',
    'discount',
    'brand',
  ];
  dataSourceProducts: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  // @ViewChild(MatPaginator) paginatorProducts: MatPaginator;
  // @ViewChild(MatSort) sortProducts: MatSort;

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
    private productsService: ProductsServicesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsersData();
    this.loadOrdersData();
    this.generateRevenueData(); // Mock data for demonstration
    this.loadCategoriesData();
    this.loadProducts();
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
        this.isVerifiedUsersCount = users.filter(
          (user) => user.isVerified
        ).length;
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

  private loadCategoriesData() {
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        // توزيع نسب عشوائية للتوضيح (يمكنك تعديلها حسب بياناتك الفعلية)
        const percentages = [18, 22, 16, 16, 14, 15];

        this.categoriesChartData = categories.map((category, index) => {
          const percentage = percentages[index];
          const total = Math.round((percentage / 100) * this.totalProducts);

          return {
            name: category.name.en,
            value: percentage,
            total: total.toLocaleString(),
            percentage: `${percentage}%`,
          };
        });
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  private loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (response) => {
        console.log('response products >>>>>>', response);
        this.products = response;
        this.totalItems = response.length;
        this.loading = false;
        this.dataSourceProducts = new MatTableDataSource(response);
        // this.dataSourceProducts.paginator = this.paginatorProducts;
        // this.dataSourceProducts.sort = this.sortProducts;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  // Calculate percentage
  calculatePercentage(value: number): number {
    const total = this.usersPieData.reduce((sum, item) => sum + item.value, 0);
    return Math.round((value / total) * 100);
  }

  private updateUsersPieChart() {
    this.usersPieData = [
      {
        name: 'New Users',
        value: this.newUsersCount,
        icon: 'fa-user-plus',
      },
      {
        name: 'Active Users',
        value: this.activeUsersCount,
        icon: 'fa-user-check',
      },
      {
        name: 'Sellers',
        value: this.sellersCount,
        icon: 'fa-store',
      },
      {
        name: 'Verified Users',
        value: this.isVerifiedUsersCount,
        icon: 'fa-user',
      },
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
