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

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
  ],
  templateUrl: './products-component.component.html',
  styleUrls: ['./products-component.component.css'],
})
export class ProductsComponentComponent implements OnInit {
  products: Product[] = [];
  totalCount: number = 0;
  page: number = 1;
  limit: number = 10;
  displayedColumns: string[] = ['image', 'name', 'price', 'actions'];

  constructor(
    private productsService: ProductsServicesService,
    public dialog: MatDialog
  ) {
    // console.log(localStorage.getItem('token'));
  }

  ngOnInit(): void {
    this.fetchProducts();
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
      width: '400px',
      data: product, // Pass the product data to the modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchProducts(); // Refresh the product list after editing
      }
    });
  }
  openAddProductModal() {}
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
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p._id !== id);
      },
      error: (err) => {
        console.error('Error deleting product:', err); // التعامل مع الأخطاء
      },
    });
  }
}
