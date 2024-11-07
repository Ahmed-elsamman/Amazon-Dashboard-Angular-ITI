import { NotificationsService } from './../../Services/notifications.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Notification } from 'src/app/Services/notifications.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mainHeader',
  templateUrl: './mainHeader.component.html',
  styleUrls: ['./mainHeader.component.css'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
})
export class MainHeaderComponent implements OnInit {
  userName: string | null = null;
  isDarkTheme$ = this.themeService.isDarkTheme$;
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private notificationsService: NotificationsService
  ) {
    this.notifications$ = this.notificationsService.notifications$;
    this.unreadCount$ = this.notificationsService.unreadCount$;
  }

  ngOnInit(): void {
    this.authService.userData$.subscribe((userInfo) => {
      this.userName = userInfo ? userInfo.userName : 'Guest';
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationsService.markAllAsRead();
    }
  }

  markAsRead(id: string) {
    this.notificationsService.markAsRead(id);
  }

  clearAllNotifications() {
    this.notificationsService.clearAll();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      default:
        return 'fa-bell';
    }
  }
}
