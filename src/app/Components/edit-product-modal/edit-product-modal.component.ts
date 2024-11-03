import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Product,
  ProductsService,
  UpdateProduct,
} from 'src/app/Services/products-services.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class EditProductModalComponent {
  product: any;
  selectedFile: File | null = null;
  private api_url: string =
    'https://ahmed-sabry-ffbbe964.koyeb.app/upload/image';

  constructor(
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productsService: ProductsService,
    private http: HttpClient
  ) {
    this.product = {
      name: data.name || { en: '', ar: '' },
      price: data.price,
      discounts: data.discounts || 0,
      description: data.description || { en: '', ar: '' },
      brand: data.brand || '',
      imageUrls: data.imageUrls.length > 0 ? [...data.imageUrls] : [''],
      stock: data.stock,
      isVerified: data.isVerified || false,
      _id: data._id,
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadImage(this.selectedFile);
    }
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(this.api_url, formData).subscribe(
      (response) => {
        this.product.imageUrls.push(response.url); // Add the new image URL to the product's imageUrls
      },
      (error) => {
        console.error('Image upload failed', error);
      }
    );
  }

  deleteImage(index: number): void {
    this.product.imageUrls.splice(index, 1); // Remove the image from the array
  }

  updateProduct(): void {
    // Create a copy of the product to avoid mutating the original data
    const updatedProduct = { ...this.product };
    delete updatedProduct._id;
    // Remove any unnecessary ID fields before sending
    if (updatedProduct.name && '_id' in updatedProduct.name) {
      delete updatedProduct.name._id;
    }
    if (updatedProduct.description && '_id' in updatedProduct.description) {
      delete updatedProduct.description._id;
    }

    this.productsService
      .updateProduct(this.product._id, updatedProduct)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
