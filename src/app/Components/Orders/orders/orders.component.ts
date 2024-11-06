import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/Services/orders.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrderComponent } from '../add-order/add-order.component';
import { UpdateOrderComponent } from '../update-order/update-order.component';
import { ViewOrderComponent } from '../view-order/view-order.component';
import { ToastrService } from 'ngx-toastr';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrderStatus } from 'src/app/Models/order.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ViewOrderComponent,
    AddOrderComponent,
    UpdateOrderComponent,
    NgxChartsModule,
    MatButtonToggleModule,
    FormsModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    '_id',
    'userId',
    'orderStatus',
    'totalPrice',
    'createdAt',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  containerWidth: number = 0;
  containerHeight: number = 0;
  orderStatusData: any[] = [];
  colorScheme: any = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#ffd700', '#2196f3', '#4caf50', '#8bc34a', '#f44336'],
  };
  view: [number, number] = [700, 700];

  chartDimensions: [number, number] = [0, 0];
  private resizeObserver!: ResizeObserver;

  selectedStatus: string = 'all';
  orderStats: any[] = [];

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.setupChartResize();
  }

  private setupChartResize() {
    const chartContainer = document.querySelector('.chart-wrapper');
    if (chartContainer) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateChartDimensions(chartContainer as HTMLElement);
      });
      this.resizeObserver.observe(chartContainer);
    }
  }

  private updateChartDimensions(container: HTMLElement) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const size = Math.min(width * 0.8, height * 0.8);
    this.chartDimensions = [size, size];
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private updateChartData(orders: any[]) {
    const statusCount = orders.reduce((acc: any, order: any) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    this.orderStatusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }));
  }

  updateOrderStats(orders: any[]) {
    const stats = {
      pending: { count: 0, icon: 'hourglass_empty' },
      shipped: { count: 0, icon: 'local_shipping' },
      delivered: { count: 0, icon: 'check_circle' },
      cancelled: { count: 0, icon: 'cancel' },
    };

    orders.forEach((order) => {
      if (stats[order.orderStatus as keyof typeof stats]) {
        stats[order.orderStatus as keyof typeof stats].count++;
      }
    });

    this.orderStats = Object.entries(stats).map(([status, data]) => ({
      status,
      count: data.count,
      icon: data.icon,
    }));
  }

  filterByStatus() {
    this.dataSource.filter =
      this.selectedStatus === 'all' ? '' : this.selectedStatus;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (filter === '') return true;
      return data.orderStatus.toLowerCase() === filter.toLowerCase();
    };
  }

  loadOrders() {
    this.isLoading = true;
    this.error = null;

    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        const sortedOrders = orders.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        this.dataSource = new MatTableDataSource(sortedOrders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateOrderStats(sortedOrders);
        this.updateChartData(sortedOrders);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders';
        this.isLoading = false;
        this.toastr.error('Failed to load orders');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewOrder(order: any) {
    this.dialog.open(ViewOrderComponent, {
      width: '600px',
      data: order,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
    });
  }

  openAddOrderDialog() {
    const dialogRef = this.dialog.open(AddOrderComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ordersService.createOrderByAdmin(result).subscribe({
          next: (newOrder) => {
            const updatedOrders = [newOrder, ...this.dataSource.data];
            this.dataSource.data = updatedOrders;
            this.updateOrderStats(updatedOrders);
            this.updateChartData(updatedOrders);
            this.toastr.success('Order added successfully');
          },
          error: (error) => {
            this.toastr.error('Failed to add order');
            console.error(error);
          },
        });
      }
    });
  }

  updateOrder(order: any) {
    const dialogRef = this.dialog.open(UpdateOrderComponent, {
      width: '600px',
      data: order,
      disableClose: true,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ordersService
          .changeOrderStatus(order._id, result.orderStatus)
          .subscribe({
            next: (updatedOrder) => {
              const updatedOrders = this.dataSource.data.map((o: any) =>
                o._id === order._id
                  ? {
                      ...o,
                      orderStatus: result.orderStatus,
                      updatedAt: new Date(),
                    }
                  : o
              );
              const sortedOrders = updatedOrders.sort((a: any, b: any) => {
                return (
                  new Date(b.updatedAt || b.createdAt).getTime() -
                  new Date(a.updatedAt || a.createdAt).getTime()
                );
              });

              this.dataSource.data = sortedOrders;
              this.updateOrderStats(sortedOrders);
              this.updateChartData(sortedOrders);
              this.toastr.success('Order updated successfully');
            },
            error: (error) => {
              this.toastr.error('Failed to update order');
              console.error(error);
            },
          });
      }
    });
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.ordersService
        .changeOrderStatus(orderId, OrderStatus.CANCELLED)
        .subscribe({
          next: () => {
            const updatedOrders = this.dataSource.data.map((o: any) =>
              o._id === orderId
                ? {
                    ...o,
                    orderStatus: OrderStatus.CANCELLED,
                    updatedAt: new Date(),
                  }
                : o
            );
            const sortedOrders = updatedOrders.sort((a: any, b: any) => {
              return (
                new Date(b.updatedAt || b.createdAt).getTime() -
                new Date(a.updatedAt || a.createdAt).getTime()
              );
            });

            this.dataSource.data = sortedOrders;
            this.updateOrderStats(sortedOrders);
            this.updateChartData(sortedOrders);
            this.toastr.success('Order cancelled successfully');
          },
          error: (error) => {
            this.toastr.error('Failed to cancel order');
            console.error(error);
          },
        });
    }
  }
}
