import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/Auth/auth.service';

@Component({
  selector: 'app-mainHeader',
  templateUrl: './mainHeader.component.html',
  styleUrls: ['./mainHeader.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MainHeaderComponent implements OnInit {
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
