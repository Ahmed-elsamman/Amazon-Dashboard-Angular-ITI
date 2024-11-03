import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Product {
  _id: string;
  sellerId: any;
  reviews: string[];
  subcategoryId: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  discounts?: number;
  description?: {
    en: string;
    ar: string;
  };
  brand?: string;
  imageUrls: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface UpdateProduct {
  name: {
    en: string;
    ar: string;
  };
  price: number;
  discounts?: number;
  description?: {
    en: string;
    ar: string;
  };
  brand?: string;
  imageUrls: string[];
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/products`;
  private apiCategoriesUrl = `${environment.API_URL}/categories`;
  private uploadUrl = `${environment.API_URL}/upload/image`;

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(this.uploadUrl, formData);
  }
  // Fetch products with pagination
  getProductsWithPagination(
    page: number,
    limit: number
  ): Observable<{ products: Product[]; totalCount: number }> {
    return this.http.get<{ products: Product[]; totalCount: number }>(
      `${this.apiUrl}/pagination?page=${page}&limit=${limit}`
    );
  }

  // Fetch product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Add new product
  addProduct(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Update product
  updateProduct(id: string, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Delete product by ID
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // ####################################
  //get categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiCategoriesUrl);
  }
}
