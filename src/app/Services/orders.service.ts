import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IOrder } from '../Models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.API_URL + '/orders';

  constructor(private http: HttpClient) {}

  // وظائف المسؤول
  createOrderByAdmin(orderData: any): Observable<IOrder> {
    return this.http
      .post<IOrder>(`${this.apiUrl}/admin/create`, orderData)
      .pipe(
        map((response) => this.transformOrderResponse(response)),
        catchError(this.handleError)
      );
  }

  updateOrderByAdmin(orderId: string, orderData: any): Observable<IOrder> {
    // تنظيف البيانات قبل إرسالها
    const { _id, createdAt, updatedAt, userId, ...cleanedData } = orderData;
    console.log('cleanedData >>>>>>>>>>>>', cleanedData);
    console.log('orderData >>>>>>>>>>>>', orderData);

    return this.http
      .patch<any>(`${this.apiUrl}/admin/${orderId}`, cleanedData)
      .pipe(
        map((response) => this.transformOrderResponse(response)),
        catchError(this.handleError)
      );
  }

  completeOrder(orderId: string, orderData: any): Observable<IOrder> {
    return this.http
      .patch<IOrder>(`${this.apiUrl}/complete/${orderId}`, orderData)
      .pipe(
        map((response) => this.transformOrderResponse(response)),
        catchError(this.handleError)
      );
  }

  getUserOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}`).pipe(
      map((response) =>
        response.map((order) => this.transformOrderResponse(order))
      ),
      catchError(this.handleError)
    );
  }

  getUserActiveOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/user/active`).pipe(
      map((response) =>
        response.map((order) => this.transformOrderResponse(order))
      ),
      catchError(this.handleError)
    );
  }

  getUserCancelledOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/user/cancelled`).pipe(
      map((response) =>
        response.map((order) => this.transformOrderResponse(order))
      ),
      catchError(this.handleError)
    );
  }

  cancelOrder(orderId: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.apiUrl}/cancel/${orderId}`, {}).pipe(
      map((response) => this.transformOrderResponse(response)),
      catchError(this.handleError)
    );
  }

  getOrderById(orderId: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${orderId}`).pipe(
      map((response) => this.transformOrderResponse(response)),
      catchError(this.handleError)
    );
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${orderId}`)
      .pipe(catchError(this.handleError));
  }

  private transformOrderResponse(response: any): IOrder {
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      userId: response.userId?._id || response.userId,
      items: response.items.map((item: any) => ({
        ...item,
        productId: item.productId?._id || item.productId,
      })),
    };
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Operation failed'));
  }
}
