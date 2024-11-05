import { Component, OnInit } from '@angular/core';
import {
  Product,
  ProductsService,
} from '../../Services/products-services.service';
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
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  ],
  providers: [ProductsService],
  templateUrl: './products-component.component.html',
  styleUrls: ['./products-component.component.css'],
})
export class ProductsComponentComponent implements OnInit {
  products: Product[] = [];
  unverifiedProducts: Product[] = [];
  totalCount: number = 0;
  page: number = 1;
  limit: number = 10;
  searchTerm: string = '';
  // charts data
  brandChartData: any[] = [];
  sellerChartData: any[] = [];
  // charts config
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Brand';
  yAxisLabel = 'Count';

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

  // إضافة متغير لتخزين المنتجات الأصلية
  originalProducts: Product[] = [];

  // إضافة خاصية جديدة لعرض الرسم البياني
  width: number = 0;

  constructor(
    private productsService: ProductsService,
    public dialog: MatDialog,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.updateChartWidth();
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.usersService.getAllUsers().subscribe((users) => {});
  }

  fetchProducts(): void {
    this.productsService
      .getProductsWithPagination(this.page, this.limit)
      .subscribe((response) => {
        this.products = response.products;
        this.originalProducts = [...response.products];
        this.totalCount = response.totalCount;
        // فلترة المنتجات غير المتحققة
        this.unverifiedProducts = this.products.filter(
          (product) => !product.isVerified
        );
        this.prepareBrandChartData();
        this.prepareSellerChartData();
      });
  }

  filterProductsToSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      // إذا كان حقل البحث فارغاً، أعد جميع المنتجات
      this.products = [...this.originalProducts];
    } else {
      // البحث في عدة حقول
      this.products = this.originalProducts.filter(
        (product) =>
          product.name.en.toLowerCase().includes(filterValue) ||
          product.name.ar?.toLowerCase().includes(filterValue) ||
          product.brand?.toLowerCase().includes(filterValue) ||
          product.price.toString().includes(filterValue) ||
          product.stock.toString().includes(filterValue)
      );
    }

    // تحديث الرسوم البيانية بعد الفلترة
    this.prepareBrandChartData();
    this.prepareSellerChartData();
  }

  openEditModal(product: Product): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '700px',
      data: product, // Pass the product data to the modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchProducts(); // Refresh the product list after editing
        this.toastr.success('Done Updating Product Successfully');
      }
    });
  }
  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchProducts();
        this.toastr.success('Done Creating Product Successfully');
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1; // Angular Material pageIndex is zero-based
    this.fetchProducts();
    this.toastr.info('Done Changing Page Successfully');
  }
  getProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.toastr.error('Error Fetching Products Try Again');
      },
    });
  }

  updateProduct(product: Product): void {
    console.log('Update product:', product);
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد أنك تريد حذف هذا المنتج؟' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter((p) => p._id !== id);
            this.toastr.success('Done Deleting Product Successfully');
          },
          error: (err) => {
            console.error('Error deleting product:', err);
            this.toastr.error('Error Deleting Product Try Again');
          },
        });
      }
    });
  }

  onSearch(): void {
    this.fetchProducts();
  }

  onResize(event: any): void {
    this.updateChartWidth();
  }
  // Brand Chart Data
  prepareBrandChartData(): void {
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

  // Seller Chart Data
  prepareSellerChartData(): void {
    const sellerCount = new Map<string, number>();
    this.products.forEach((product) => {
      const count = sellerCount.get(product.sellerId.name) || 0;
      sellerCount.set(product.sellerId.name, count + 1);
      // console.log('sellerId >>>>>>>>>>>>>>', product.sellerId);
    });

    this.sellerChartData = Array.from(sellerCount).map(([name, value]) => ({
      name,
      value: (value / this.products.length) * 100,
    }));
  }

  // إضافة طريقة جديدة لحساب عرض الرسم البياني
  private updateChartWidth(): void {
    const containerWidth = window.innerWidth;
    if (containerWidth > 1200) {
      this.width = Math.min(containerWidth * 0.8, 1000);
    } else if (containerWidth > 992) {
      this.width = containerWidth * 0.85;
    } else if (containerWidth > 768) {
      this.width = containerWidth * 0.9;
    } else {
      this.width = containerWidth - 40; // للهوامش
    }
  }
}
