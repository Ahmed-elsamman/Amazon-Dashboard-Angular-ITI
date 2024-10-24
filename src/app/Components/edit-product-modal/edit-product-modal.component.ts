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
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productsService: ProductsServicesService
  ) {
    this.product = { ...data }; // Create a copy of the product data to edit
  }

  updateProduct(): void {
    this.productsService.updateProduct(this.product).subscribe({
      next: () => {
        this.dialogRef.close(true); // Return true to indicate successful update
      },
      error: (err) => {
        console.error('Error updating product:', err);
        // Optionally handle errors here, e.g., show an alert
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without saving changes
  }
}
