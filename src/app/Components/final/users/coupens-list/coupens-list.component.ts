import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IfireBseProduct } from 'src/app/Models/ifire-base-prd';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-products-list',
  templateUrl: './coupens-list.component.html',
  styleUrls: ['./coupens-list.component.css']
})
export class  CoupensListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['_id', 'createdAt', 'title','imageCover' ,'price'];
  dataSource: MatTableDataSource<IfireBseProduct> = new MatTableDataSource<IfireBseProduct>([]);
  clickedRows = new Set<IfireBseProduct>();
  date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private firebasePrdService: FirebasePrdService) {}

  ngOnInit(): void {
    this.firebasePrdService.getProducts().subscribe({
      next: (product: (DocumentData | (DocumentData & { id: string; }))[]) => {
        const products: IfireBseProduct[] = product.map((prdData) => {
          if ('id' in prdData) {
            const { id, ...rest } = prdData;
            // console.log(prdData);
            return { title: id, ...rest } as IfireBseProduct;
          }
          return prdData as IfireBseProduct;
        });

        console.log('Recieved Products:',  products);

        this.dataSource.data =  products;
      },
      error: (err) => {
        console.log('Error fetching products:', err);
      },
      complete: () => {
        console.log('products fetching completed.');
      },
    });
  }

  onRowClick(row: IfireBseProduct): void {
    if (this.clickedRows.has(row)) {
      this.clickedRows.delete(row);
    } else {
      this.clickedRows.add(row);
    }
  }

  isRowClicked(row: IfireBseProduct): boolean {
    return this.clickedRows.has(row);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
