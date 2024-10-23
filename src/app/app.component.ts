import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from './Components/header/header.component';
import { SideMenuComponent } from './Components/final/side-menu/side-menu.component';
import { BodyComponent } from './Components/final/body/body.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    RouterModule,
    HeaderComponent,
    SideMenuComponent,
    BodyComponent,
    NgxSpinnerModule,
    MatDialogModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'Amazon';

  showHeader = true;

  constructor(private router: Router, private spinner: NgxSpinnerService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url == '/login') {
          this.showHeader = false;
        } else {
          this.showHeader = true;
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
