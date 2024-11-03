import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private apiUrl = `${environment.API_URL}/sellers`;

  constructor(private http: HttpClient) {}

  // تحديث حالة البائع (موافقة/رفض)
  updateSellerStatus(
    sellerId: string,
    status: 'approved' | 'rejected'
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/approve-seller/${sellerId}`, {
      status,
    });
  }

  // التحقق من حالة البائع
  checkSellerStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }

  // الحصول على جميع البائعين
  getAllSellers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // الحصول على البائعين حسب الحالة
  getSellersByStatus(
    status: 'pending' | 'approved' | 'rejected'
  ): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-status/${status}`);
  }

  // الحصول على بائع محدد بواسطة المعرف
  getSellerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // حذف بائع
  deleteSeller(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // الحصول على إحصائيات البائعين
  getSellerStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/overview`);
  }
}
