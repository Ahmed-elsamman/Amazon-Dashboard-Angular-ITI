import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IfireBseProduct } from 'src/app/Models/ifire-base-prd';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
// import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements OnInit {
  bestSellers: IfireBseProduct[] = [];
  discount: IfireBseProduct[] = [];
  responsiveOptions: any;


  constructor(private firebasePrdService: FirebasePrdService) {}

  ngOnInit(): void {
    this.getBestSellers();
    this.Discount();


  }

  getBestSellers(): void {
    this.firebasePrdService.getBestSellers().subscribe({
      next: (bestSellers: IfireBseProduct[]) => {
        this.bestSellers = bestSellers;
      },
      error: (err) => {
        console.log(err);
        alert(`something went wrong ${err.message}`);
      },
      complete: () => {
        console.log('best sellers fetching completed.');
      },
    });
  }

// -------------------------------
Discount(): void {
  this.firebasePrdService.getDisCount().subscribe({
    next: (discount: IfireBseProduct[]) => {
      this.discount = discount;
      console.log(discount);

    },
    error: (err) => {
      console.log(err);
      alert(`something went wrong ${err.message}`);
    },
    complete: () => {
      console.log('best sellers discount fetching completed.');
    },
  });
}
}
