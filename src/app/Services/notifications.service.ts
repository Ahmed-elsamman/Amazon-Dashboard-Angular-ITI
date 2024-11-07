import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  isRead: boolean;
  category: 'products' | 'orders' | 'users' | 'sellers';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);

  // إضافة Subjects للمراقبة
  private productsUpdateSubject = new Subject<void>();
  private ordersUpdateSubject = new Subject<void>();
  private usersUpdateSubject = new Subject<void>();
  private sellersUpdateSubject = new Subject<void>();

  // Observables للاستماع للتحديثات
  productsUpdate$ = this.productsUpdateSubject.asObservable();
  ordersUpdate$ = this.ordersUpdateSubject.asObservable();
  usersUpdate$ = this.usersUpdateSubject.asObservable();
  sellersUpdate$ = this.sellersUpdateSubject.asObservable();

  unreadCount$ = this.unreadCountSubject.asObservable();

  // دالة لإخطار التغييرات في المنتجات
  notifyProductsUpdate(message: string) {
    this.addNotification(message, 'info', 'products');
    this.productsUpdateSubject.next();
  }

  // دالة لإخطار التغييرات في الطلبات
  notifyOrdersUpdate(message: string) {
    this.addNotification(message, 'info', 'orders');
    this.ordersUpdateSubject.next();
  }

  // دالة لإخطار التغييرات في المستخدمين
  notifyUsersUpdate(message: string) {
    this.addNotification(message, 'info', 'users');
    this.usersUpdateSubject.next();
  }

  // دالة لإخطار التغييرات في البائعين
  notifySellersUpdate(message: string) {
    this.addNotification(message, 'info', 'sellers');
    this.sellersUpdateSubject.next();
  }

  addNotification(
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    category: 'products' | 'orders' | 'users' | 'sellers'
  ) {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      isRead: false,
      category,
    };

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([newNotification, ...currentNotifications]);
    this.updateUnreadCount();

    // إضافة صوت تنبيه
    this.playNotificationSound();
  }

  private playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch((err) => console.log('Audio play failed:', err));
  }

  markAsRead(id: string) {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead() {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  clearAll() {
    this.notifications.next([]);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unreadCount = this.notifications
      .getValue()
      .filter((notification) => !notification.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }
}
