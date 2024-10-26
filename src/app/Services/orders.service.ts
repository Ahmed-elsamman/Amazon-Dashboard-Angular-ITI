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

  // إنشاء طلب جديد
  initiateOrder(orderData: any): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.apiUrl}/initiate`, orderData).pipe(
      map((response) => this.transformOrderResponse(response)),
      catchError(this.handleError)
    );
  }

  // إكمال الطلب
  completeOrder(orderId: string, orderData: any): Observable<IOrder> {
    return this.http.patch<IOrder>(
      `${this.apiUrl}/complete/${orderId}`,
      orderData
    );
  }

  // الحصول على طلبات المستخدم
  getUserOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}`);
  }

  // الحصول على الطلبات النشطة للمستخدم
  getUserActiveOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/user/active`);
  }

  // الحصول على الطلبات الملغاة للمستخدم
  getUserCancelledOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/user/cancelled`);
  }

  // إلغاء طلب
  cancelOrder(orderId: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.apiUrl}/cancel/${orderId}`, {});
  }

  // الحصول على تفاصيل طلب معين
  getOrderById(orderId: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${orderId}`);
  }

  updateOrder(orderId: string, orderData: any): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.apiUrl}/${orderId}`, orderData).pipe(
      map((response) => this.transformOrderResponse(response)),
      catchError(this.handleError)
    );
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${orderId}`);
  }

  private transformOrderResponse(response: any): IOrder {
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Operation failed'));
  }
}
