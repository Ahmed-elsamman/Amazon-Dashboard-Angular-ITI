import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from './Components/header/header.component';
import { SideMenuComponent } from './Components/final/side-menu/side-menu.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './Services/Auth/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SideMenuComponent,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'Amazon Dashboard';

  showHeader = true;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    // مراقبة حالة التوجيه
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const currentPath = val.urlAfterRedirects.split('/')[1];
        if (['login', 'register'].includes(currentPath)) {
          this.showHeader = false;
        } else {
          // هنا يجب أن تتحقق من حالة تسجيل الدخول
          this.authService.isUserLoggedIn$.subscribe((isAuth) => {
            this.showHeader = isAuth;
          });
        }
      }
    });
  }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  isSidenav = false;
  screenWidth = 0;
  onToggleSideNav(data: SideNavToggle) {
    this.screenWidth = data.screenWidth;
    this.isSidenav = data.collapsed;
  }
}
