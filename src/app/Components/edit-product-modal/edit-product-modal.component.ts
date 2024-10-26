import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  ProductsServicesService,
  Product,
  UpdateProduct,
} from 'src/app/Services/products-services.service';

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
  ],
})
export class EditProductModalComponent {
  product: UpdateProduct;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productsService: ProductsServicesService,
  ) {
    this.product = {
      name: data.name || { en: '', ar: '' },
      price: data.price,
      discounts: data.discounts || 0,
      description: data.description || { en: '', ar: '' },
      brand: data.brand || '',
      imageUrls: data.imageUrls.length > 0 ? [...data.imageUrls] : [''],
      stock: data.stock,
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  updateProduct(): void {

  }

  private submitProductUpdate(): void {
    const updatedProduct = { ...this.product };

    // Remove any unnecessary ID fields before sending
    if (updatedProduct.name && '_id' in updatedProduct.name) {
      delete updatedProduct.name._id;
    }
    if (updatedProduct.description && '_id' in updatedProduct.description) {
      delete updatedProduct.description._id;
    }

    this.productsService
      .updateProduct(this.data._id, updatedProduct)
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
