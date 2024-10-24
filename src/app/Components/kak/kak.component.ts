import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from 'src/app/Services/Auth/auth.service';

@Component({
  selector: 'app-kak',
  templateUrl: './kak.component.html',
  styleUrls: ['./kak.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class KakComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userData$.subscribe((userInfo) => {
      this.userName = userInfo ? userInfo.userName : 'Guest';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
