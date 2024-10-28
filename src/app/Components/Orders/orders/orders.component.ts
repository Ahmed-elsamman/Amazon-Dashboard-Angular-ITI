import { Component, OnInit, ViewChild } from '@angular/core';
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
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
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

  loadOrders() {
    this.isLoading = true;
    this.error = null;

    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'فشل في تحميل الطلبات';
        this.isLoading = false;
        this.toastr.error('فشل في تحميل الطلبات');
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
            this.toastr.success('تم إضافة الطلب بنجاح');
            this.loadOrders();
          },
          error: (error) => {
            this.toastr.error('فشل في إضافة الطلب');
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
        this.ordersService.updateOrderByAdmin(order._id, result).subscribe({
          next: () => {
            this.toastr.success('تم تحديث الطلب بنجاح');
            this.loadOrders();
          },
          error: (error) => {
            this.toastr.error('فشل في تحديث الطلب');
            console.error(error);
          },
        });
      }
    });
  }

  deleteOrder(orderId: string) {
    //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //     width: '400px',
    //     data: {
    //       title: 'تأكيد الحذف',
    //       message: 'هل أنت متأكد من حذف هذا الطلب؟',
    //       confirmText: 'حذف',
    //       cancelText: 'إلغاء'
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.ordersService.deleteOrder(orderId).subscribe({
    //         next: () => {
    //           this.toastr.success('تم حذف الطلب بنجاح');
    //           this.loadOrders();
    //         },
    //         error: (error) => {
    //           this.toastr.error('فشل في حذف الطلب');
    //           console.error(error);
    //         },
    //       });
    //     }
    //   });
  }
}
