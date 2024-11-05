import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from 'src/app/Services/products-services.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.css',
})
export class CreateProductModalComponent {
  private api_url: string =
    'https://ahmed-sabry-ffbbe964.koyeb.app/upload/image';
  productForm: FormGroup;
  imageUrls: string[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      subcategoryId: ['', Validators.required],
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required],
      brand: [''],
      descriptionEn: [''],
      descriptionAr: [''],
    });
  }

  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }
  // Define subCategoriesIDs as an object
  subCategoriesIDs = {
    Smartphones: '66f9c3772cd468548df8b112',
    'Home Cleaning': '66f9c3772cd468548df8b118',
    'Gym Equipment': '66f9c3772cd468548df8b113',
    Makeup: '66f9c3772cd468548df8b11c',
    Laptops: '66f9c3772cd468548df8b111',
    Fiction: '66f9c3772cd468548df8b115',
    'Kitchen Appliances': '66f9c3772cd468548df8b117',
    "Men's Clothing": '66f9c3772cd468548df8b119',
    "Women's Clothing": '66f9c3772cd468548df8b11a',
    'Outdoor Sports': '66f9c3772cd468548df8b114',
    Science: '66f9c3772cd468548df8b116',
    Skincare: '66f9c3772cd468548df8b11b',
    Drones: '66f9c4132cd468548df8b11f',
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(this.api_url, formData).subscribe(
      (response) => {
        this.imageUrls.push(response.url);
      },
      (error) => {
        console.error('Image upload failed', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = {
        subcategoryId: this.productForm.value.subcategoryId,
        price: this.productForm.value.price,
        stock: this.productForm.value.stock,
        brand: this.productForm.value.brand,
        name: {
          en: this.productForm.value.nameEn,
          ar: this.productForm.value.nameAr,
        },
        description: {
          en: this.productForm.value.descriptionEn,
          ar: this.productForm.value.descriptionAr,
        },
        imageUrls: this.imageUrls,
      };

      this.productsService.addProduct(productData).subscribe({
        next: () => {
          this.onClose();
        },
        error: (err) => {
          console.error('Error creating product:', err);
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
