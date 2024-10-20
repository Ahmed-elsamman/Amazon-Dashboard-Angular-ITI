import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output ,inject, AfterViewInit, ViewChild} from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { IfireBseProduct } from 'src/app/Models/ifire-base-prd';
import {MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProductFormComponent } from '../update-product-form/update-product-form.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  // private readonly storage: Storage = inject(Storage);
  displayedColumns: string[] = ['id','imageCover', 'title', 'price', 'quantity','inStock','update','delete'];
  dataSource: MatTableDataSource<IfireBseProduct> = new MatTableDataSource<IfireBseProduct>([]);
  clickedRows = new Set<IfireBseProduct>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  date = new Date();
  prds:IfireBseProduct[]=[];
  quantityAvalable:number=0;
  prdToAdd: IfireBseProduct = {} as IfireBseProduct;
  isUpdate:boolean=false;
  coverImageFileName: string = '';
  prodductImageFileName: string = '';

  constructor(private router: Router,
    private storage: Storage,
    private FirebasePrdService:FirebasePrdService,
    private _dialog:MatDialog) {
    
      this.prdToAdd = {
        brand: {
          name: '',
          slug: '',
          image: '',
          _id: ''
        },
        category: {
          slug: '',
          name: '',
          image: '',
          _id: ''
        },
        createdAt: '',
        description: '',
        id: '',
        imageCover: '',
        images: [],
        price: 0,
        priceAfterDiscount: 0,
        quantity: 0,
        ratingsAverage: 0,
        ratingsQuantity: 0,
        slug: '',
        sold: 0,
        subcategory: [],
        title: '',
        updatedAt: '',
      };
  }

  openEditproductForm(data:IfireBseProduct){
    const dialogRef=this._dialog.open(UpdateProductFormComponent,{data})
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getProducts();
        }
      }
    })
  }
  getProducts(){
    this.FirebasePrdService.getProducts().subscribe({
      next: (product: (DocumentData | (DocumentData & { id: string; }))[]) => {
        const products: IfireBseProduct[] = product.map((prdData) => {
          if ('id' in prdData) {
            const { id, ...rest } = prdData;
            return { id: id, ...rest } as IfireBseProduct;
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
  deleteProduct(id: string) {
    console.log('Deleting product...');
    console.log(id);
    
    this.FirebasePrdService.deleteProduct(id)
      .then(() => {
        console.log(`Product with ID ${id} deleted successfully.`);
        this.getProducts();
      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
      });
  }
  goToForm(){
    this.router.navigate(['/product-upload-form']);
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
    console.log(this.dataSource.filter);
    

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addProduct(){
    this.FirebasePrdService.addProduct(this.prdToAdd);
    this.getProducts();
  }

//   onImageCoverSelected(event: any) {
//     if (!event.files) return

//     const files: FileList = event.files;

//     for (let i = 0; i < files.length; i++) {
//         const file = files.item(i);
//         if (file) {
//             const storageRef = ref(this.storage, file.name);
//             uploadBytesResumable(storageRef, file);
//         }
//     }
// }

  // onImageCoverSelected(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files?.length) {
  //     this.coverImageFileName = inputElement.files[0].name;
  //   }
  // }

  onImagesSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files?.length) {
      this.prodductImageFileName = inputElement.files[0].name;
    }
  }

  ngOnInit(): void {
    this.getProducts();
  }

}