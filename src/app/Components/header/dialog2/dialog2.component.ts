import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog2',
  templateUrl: './dialog2.component.html',
  styleUrls: ['./dialog2.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogModule],
})
export class Dialog2Component {}
