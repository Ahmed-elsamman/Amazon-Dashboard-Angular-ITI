import { Router } from '@angular/router';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { languages, notifications, userItem } from './header-dummy-data';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Dialog2Component } from './dialog2/dialog2.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from 'src/app/Services/Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    CdkMenuModule,
    MatBadgeModule,
  ],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  user: boolean = true;

  constructor(
    private Toster: ToastrService,
    private Router: Router,
    private productService: FirebasePrdService,
    public dialog: MatDialog,
    private UserAuth: AuthService
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog2() {
    const dialogRef = this.dialog.open(Dialog2Component, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  hidden = false;
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
  }

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;

  languages = languages;
  notifications = notifications;
  userItem = userItem;

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'head-m-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  set listFilter(value: string) {
    this.productService.PerformSearch(value);
    this.productService.filterProducts(value);
  }

  logOut() {
    this.UserAuth.logout();
    this.UserAuth.isUserLoggedIn$.subscribe((status) => {
      this.user = status;
    });

    localStorage.removeItem('currentUser');
    this.Toster.error('logOut', 'logOut Success');
  }

  onLanguageClick(selectedLanguage: any) {
    console.log('Selected language:', selectedLanguage.language);
    this.selectedLanguage = selectedLanguage;
  }

  onUserItemClick(item: any) {
    console.log('Item Clicked:', item);
    if (item.lable === 'Profile') {
      console.log('Navigating to /settings/profile');
      this.Router.navigate(['/settings/profile']);
    } else if (item.lable === 'Logout') {
      console.log('Logging out. Redirecting to login page.');

      this.Router.navigate(['/login']);
      this.logOut();
    }
  }
}
