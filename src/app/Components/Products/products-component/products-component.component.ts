import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  Product,
  ProductsService,
} from '../../../Services/products-services.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from 'src/app/Services/users/users.service';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
    CreateProductModalComponent,
    EditProductModalComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxChartsModule,
    ToastrModule,
    MatCardModule,
  ],
  templateUrl: './products-component.component.html',
  styleUrls: ['./products-component.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('rowHover', [
      state(
        'hovered',
        style({
          transform: 'scale(1.02)',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        })
      ),
      state(
        'normal',
        style({
          transform: 'scale(1)',
          backgroundColor: 'transparent',
        })
      ),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out')),
    ]),
  ],
})
export class ProductsComponentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table configuration
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'brand',
    'stock',
    'isVerified',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource: MatTableDataSource<Product>;
  hoveredRow: Product | null = null;

  // Products data
  products: Product[] = [];
  unverifiedProducts: Product[] = [];
  originalProducts: Product[] = [];

  // Chart configuration
  brandChartData: any[] = [];
  sellerChartData: any[] = [];
  chartView: [number, number] = [700, 400];
  chartWidth: number = 0;

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<Product>();
    this.updateChartWidth();

    window.addEventListener('resize', () => {
      this.brandChartData = [...this.brandChartData];
      this.sellerChartData = [...this.sellerChartData];
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // تعيين حجم الصفحة الافتراضي إلى 5
    this.paginator._intl.itemsPerPageLabel = 'Products per page:';
    this.paginator.pageSize = 5;

    // تعيين الفرز الافتراضي
    this.sort.sort({ id: 'updatedAt', start: 'desc' } as MatSortable);
  }

  private setupDataSource(): void {
    this.dataSource.sortingDataAccessor = (item: Product, property: string) => {
      switch (property) {
        case 'updatedAt':
          return new Date(item.updatedAt || '').getTime();
        case 'createdAt':
          return new Date(item.createdAt || '').getTime();
        case 'price':
          return Number(item.price);
        case 'stock':
          return Number(item.stock);
        case 'name':
          return item.name.en.toLowerCase();
        case 'brand':
          return item.brand?.toLowerCase() || '';
        case 'isVerified':
          return item.isVerified ? 1 : 0;
        default:
          return (item as any)[property];
      }
    };
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response;
        this.unverifiedProducts = this.products.filter(
          (product) => !product.isVerified
        );

        this.products.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA;
        });

        this.dataSource.data = this.products;
        this.updateCharts();
      },
      error: (error) => {
        this.toastr.error('Error loading products');
        console.error('Error:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.componentInstance.productCreated.subscribe(() => {
      dialogRef.close();
      this.loadProducts();
      this.toastr.success('Product created successfully');
    });

    dialogRef.componentInstance.cancelCreate.subscribe(() => {
      dialogRef.close();
    });
  }

  openEditModal(product: Product): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '700px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.sort.sort({ id: 'updatedAt', start: 'desc' } as MatSortable);
        this.toastr.success('Product updated successfully');
      }
    });
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { message: 'Are you sure you want to delete this product?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.toastr.success('Product deleted successfully');
          },
          error: () => {
            this.toastr.error('Error deleting product');
          },
        });
      }
    });
  }

  private updateCharts(): void {
    this.prepareBrandChartData();
    this.prepareSellerChartData();
  }

  private prepareBrandChartData(): void {
    const brandCount = new Map<string, number>();
    this.products.forEach((product) => {
      const count = brandCount.get(product?.brand || '') || 0;
      brandCount.set(product?.brand || '', count + 1);
    });

    this.brandChartData = Array.from(brandCount).map(([name, value]) => ({
      name,
      value: (value / this.products.length) * 100,
    }));
  }

  private prepareSellerChartData(): void {
    const sellerCount = new Map<string, number>();
    this.products.forEach((product) => {
      const count = sellerCount.get(product.sellerId.name) || 0;
      sellerCount.set(product.sellerId.name, count + 1);
    });

    this.sellerChartData = Array.from(sellerCount).map(([name, value]) => ({
      name,
      // value: (value / this.products.length) * 100,
      value: value,
    }));
  }

  onResize(event: any): void {
    this.updateChartWidth();
  }

  private updateChartWidth(): void {
    const containerWidth = window.innerWidth;
    if (containerWidth > 1200) {
      this.chartWidth = Math.min(containerWidth * 0.8, 1000);
    } else if (containerWidth > 992) {
      this.chartWidth = containerWidth * 0.85;
    } else if (containerWidth > 768) {
      this.chartWidth = containerWidth * 0.9;
    } else {
      this.chartWidth = containerWidth - 40;
    }
  }

  getResponsiveWidth(): number {
    const container = document.querySelector('.chart-wrapper');
    if (container) {
      return container.clientWidth - 50; // نقص 50 للهوامش
    }
    return window.innerWidth - 100; // قيمة افتراضية
  }
}
