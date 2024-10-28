import { animate } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `<h2 mat-dialog-title>are you sure deleting this product?</h2>
    <!-- <mat-dialog-content>{{ data.message }}</mat-dialog-content> -->
    <mat-dialog-actions>
      <button class="btn btn-danger mr-4" (click)="onNoClick()">NO</button>
      <button class="btn btn-primary" (click)="onYesClick()">YES</button>
    </mat-dialog-actions>`,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
