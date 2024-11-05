import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import {
  merge,
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, NgClass } from '@angular/common';
import { SellerService } from '../../../Services/seller.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewSellerComponent } from './view-seller/view-seller.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';

export interface SellerData {
  _id: string;
  fullName: string;
  country: string;
  businessName: string;
  status: string;
  ordersCount: number;
  productsCount: number;
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    ToastrModule,
  ],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css',
})
export class SellerComponent implements AfterViewInit, OnDestroy {
  private sellerService = inject(SellerService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  AllSubscribes: Subscription[] = [];
  searchControl = new FormControl('');
  dataSource: MatTableDataSource<SellerData>;

  displayedColumns: string[] = [
    '_id',
    'fullName',
    'country',
    'businessName',
    'status',
    'ordersCount',
    'productsCount',
    'actions',
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  // Add new property for pagination loading
  isPaginationLoading = false;

  // إضافة متغير جديد للإحصائيات
  sellerStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private toastr: ToastrService) {
    this.dataSource = new MatTableDataSource<SellerData>();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription(): void {
    const searchSub = this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value || '');
      });

    this.AllSubscribes.push(searchSub);
  }

  private applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate for multiple columns
    this.dataSource.filterPredicate = (data: SellerData, filter: string) => {
      const searchStr = (
        data.fullName +
        data.country +
        data.businessName +
        data.status
      ).toLowerCase();
      return searchStr.indexOf(filter) !== -1;
    };

    // Subscribe to paginator events
    const paginatorSub = this.paginator.page
      .pipe(
        tap(() => {
          this.isPaginationLoading = true;
          // Simulate API call delay
          setTimeout(() => {
            this.isPaginationLoading = false;
          }, 500);
        })
      )
      .subscribe();

    this.AllSubscribes.push(paginatorSub);

    const dataSub = this.loadInitialData();
    this.AllSubscribes.push(dataSub);

    // إضافة استدعاء للإحصائيات
    this.loadSellerStats();
  }

  private loadInitialData(): Subscription {
    return this.sellerService.getAllSellers().subscribe({
      next: (sellers) => {
        // ترتيب البائعين حسب آخر تحديث
        const sortedSellers = sellers.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA; // ترتيب تنازلي (الأحدث أولاً)
        });

        this.dataSource.data = sortedSellers.map((seller) => ({
          _id: seller._id,
          fullName: seller.fullName,
          country: seller.country,
          businessName: seller.businessName,
          status: seller.status,
          ordersCount: seller.ordersCount || 0,
          productsCount: seller.productsCount || 0,
        }));

        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
      },
    });
  }

  private loadSellerStats(): void {
    const statsSub = this.sellerService.getSellerStats().subscribe({
      next: (stats) => {
        this.sellerStats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      },
    });
    this.AllSubscribes.push(statsSub);
  }

  ngOnDestroy(): void {
    this.AllSubscribes.forEach((sub) => sub.unsubscribe());
  }

  updateStatus(sellerId: string, status: 'approved' | 'rejected'): void {
    if (status === 'rejected') {
      this.openConfirmDialog(sellerId);
    } else {
      this.processStatusUpdate(sellerId, status);
    }
  }

  private openConfirmDialog(sellerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Rejection',
        message: 'Are you sure you want to reject this seller?',
        confirmText: 'Reject',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.processStatusUpdate(sellerId, 'rejected');
        this.toastr.success('Seller rejected successfully');
      }
    });
  }

  private processStatusUpdate(
    sellerId: string,
    status: 'approved' | 'rejected'
  ): void {
    this.isPaginationLoading = true;

    this.sellerService
      .updateSellerStatus(sellerId, status)
      .pipe(finalize(() => (this.isPaginationLoading = false)))
      .subscribe({
        next: () => {
          this.updateLocalData(sellerId, status);
          this.toastr.success(`Seller successfully ${status}`);
          this.loadSellerStats(); // تحديث الإحصائيات
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.toastr.error('Failed to update seller status');
        },
      });
  }

  private updateLocalData(sellerId: string, status: string): void {
    const index = this.dataSource.data.findIndex(
      (item) => item._id === sellerId
    );
    if (index !== -1) {
      this.dataSource.data[index].status = status;
      this.dataSource._updateChangeSubscription();
    }
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }

  viewSeller(seller: SellerData) {
    this.sellerService.getSellerById(seller._id).subscribe({
      next: (sellerDetails) => {
        const dialogRef = this.dialog.open(ViewSellerComponent, {
          width: '800px',
          maxHeight: '90vh',
          data: sellerDetails,
          panelClass: 'seller-dialog',
        });
      },
      error: (error) => {
        console.error('Error fetching seller details:', error);
        // يمكنك إضافة رسالة خطأ للمستخدم هنا
      },
    });
  }
}
