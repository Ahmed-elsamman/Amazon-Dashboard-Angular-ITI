import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Iproduct } from 'src/app/Models/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { ProductsApiService } from './../../Services/products-api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  productID: number = 0;
  product: Iproduct | undefined = undefined;
  products: Iproduct[] = [];
  prodIDList: number[] = [];
  currentPrdIndex: number = 0;

  constructor(private productsApiService: ProductsApiService, private prdService: ProductsService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    // this.productID = (this.activatedRoute.snapshot.paramMap.get('id')) ? Number(this.activatedRoute.snapshot.paramMap.get('id')) : 0;
    // console.log(this.productID);

    // this.product = this.prdService.getProdByID(this.productID);
    // console.log(this.product);

    this.prodIDList = this.prdService.getProdIDList();
    // console.log(this.prodIDList);

    this.activatedRoute.paramMap.subscribe((param) => {
      this.productID = (param.get('id')) ? Number(param.get('id')) : 0;
      // let foundProd = this.prdService.getProdByID(this.productID);
      // if (foundProd) {
      //   this.product = foundProd;
      // } else {
      //   alert("Product not found");
      //   this.router.navigate(['/products]']);
      // }
      this.productsApiService.getPrdById(this.productID).subscribe(data => {
        console.log(data);
        this.product = data;
      }
      );
    })
  }

  goBackFunc() {
    this.router.navigate(['/products'])
  }
  nextFunc() {
    this.currentPrdIndex = this.prodIDList.indexOf(this.productID);
    // console.log(this.currentPrdIndex);
    this.router.navigate(['/details', this.prodIDList[++this.currentPrdIndex]])
  }
  prevFunc() {
    this.currentPrdIndex = this.prodIDList.indexOf(this.productID);
    // console.log(this.currentPrdIndex);
    this.router.navigate(['/details', this.prodIDList[--this.currentPrdIndex]])
  }

  deleteProduct(productID: number) {
      this.productsApiService.deleteProduct(productID);
      this.router.navigate(['/products']);
  }
}
