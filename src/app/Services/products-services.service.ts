import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: string;
  sellerId: string;
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
}

@Injectable({
  providedIn: 'root',
})
export class ProductsServicesService {
  private apiUrl = 'https://ahmed-sabry-ffbbe964.koyeb.app/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsWithPagination(
    page: number,
    limit: number
  ): Observable<{ products: Product[]; totalCount: number }> {
    return this.http.get<{ products: Product[]; totalCount: number }>(
      `${this.apiUrl}/pagination?page=${page}&limit=${limit}`
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
