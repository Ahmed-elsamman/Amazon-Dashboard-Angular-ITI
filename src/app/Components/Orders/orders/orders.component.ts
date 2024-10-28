import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, AfterViewInit {
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

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    const container = document.querySelector('.charts-container');
    if (container) {
      this.containerWidth = container.clientWidth;
      this.containerHeight = container.clientHeight - 40; // نقص 40 لارتفاع العنوان
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

  loadOrders() {
    this.isLoading = true;
    this.error = null;

    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateChartData(orders);
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
          next: () => {
            this.toastr.success('Order added successfully');
            this.loadOrders();
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
        console.log('result>>>>', result);
        this.ordersService
          .changeOrderStatus(order._id, result.orderStatus)
          .subscribe({
            next: () => {
              this.toastr.success('Order updated successfully');
              this.loadOrders();
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
    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      this.ordersService
        .changeOrderStatus(orderId, OrderStatus.CANCELLED)
        .subscribe({
          next: () => {
            this.toastr.success('تم إلغاء الطلب بنجاح');
            this.loadOrders();
          },
          error: (error) => {
            this.toastr.error('فشل في إلغاء الطلب');
            console.error(error);
          },
        });
    }
  }
}
