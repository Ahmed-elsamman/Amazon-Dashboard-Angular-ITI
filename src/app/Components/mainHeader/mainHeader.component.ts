import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ThemeService } from 'src/app/Services/theme.service';

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

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

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
}
