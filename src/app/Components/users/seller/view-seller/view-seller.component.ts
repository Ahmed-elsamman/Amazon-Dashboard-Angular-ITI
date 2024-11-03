import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface SellerData {
  _id: string;
  userId: string;
  status: string;
  businessName: string;
  businessNameArabic: string;
  registrationNumber: string;
  country: string;
  addressLine: string;
  governorate: string;
  phoneNumber: string;
  fullName: string;
  countryOfCitizenship: string;
  countryOfBirth: string;
  dateOfBirth: string;
  identityProof: string;
  countryOfIssue: string;
  nationalIdOrPassport: string;
  cardNumber: string;
  expirationDate: string;
  cardHolderName: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-view-seller',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './view-seller.component.html',
  styleUrl: './view-seller.component.css',
})
export class ViewSellerComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SellerData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
