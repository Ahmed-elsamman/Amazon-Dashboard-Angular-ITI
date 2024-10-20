import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iproduct } from 'src/app/Models/iproduct';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  products: Iproduct[] = [];
  http = {};
  constructor(private httpClient: HttpClient) {
    this.http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }
  getAllProducts(): Observable<Iproduct[]> {
    return this.httpClient.get<Iproduct[]>(`${environment.APIBaseURL}/products`);
  }
  getPrdById(id: number): Observable<Iproduct> {
    return this.httpClient.get<Iproduct>(`${environment.APIBaseURL}/products/${id}`);
  }
  getPrdByCatId(id: number): Observable<Iproduct[]> {
    return this.httpClient.get<Iproduct[]>(`${environment.APIBaseURL}/products?categoryID=${id}`);
  }

  addNewProduct(newProduct: Iproduct): Observable<Iproduct> {
    return this.httpClient.post<Iproduct>(`${environment.APIBaseURL}/products`, JSON.
      stringify(newProduct), this.http);
  }

  updateProduct(id: number, updatedProduct: Iproduct): Observable<Iproduct> {
    return this.httpClient.put<Iproduct>(`${environment.APIBaseURL}/products/${id}`, JSON.stringify(updatedProduct), this.http);
  }

  deleteProduct(productID: number) {
    this.httpClient.delete(`${environment.APIBaseURL}/products/${productID}`).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== productID);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

}
