import { Component, OnInit } from '@angular/core';
import {
  ProductsServicesService,
  Product,
} from './../../Services/products-services.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from 'src/app/Services/users/users.service';
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';
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
  ],
  templateUrl: './products-component.component.html',
  styleUrls: ['./products-component.component.css'],
})
export class ProductsComponentComponent implements OnInit {
  products: Product[] = [];
  totalCount: number = 0;
  page: number = 1;
  limit: number = 10;

  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'brand',
    'stock',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  constructor(
    private productsService: ProductsServicesService,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    // console.log(localStorage.getItem('token'));
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.usersService.getAllUsers().subscribe((users) => {
      console.log('users:>>>>>>>>>>>>>>>>>>>', users);
    });
  }

  fetchProducts(): void {
    this.productsService
      .getProductsWithPagination(this.page, this.limit)
      .subscribe((response) => {
        this.products = response.products;
        this.totalCount = response.totalCount;
      });
  }

  openEditModal(product: Product): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '700px',
      data: product, // Pass the product data to the modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchProducts(); // Refresh the product list after editing
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
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1; // Angular Material pageIndex is zero-based
    this.fetchProducts();
  }
  getProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
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
          },
          error: (err) => {
            console.error('Error deleting product:', err);
          },
        });
      }
    });
  }
}
