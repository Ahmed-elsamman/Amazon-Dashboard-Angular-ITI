import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { IfireBseProduct } from 'src/app/Models/ifire-base-prd';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-product-form.component.html',
  styleUrls: ['./update-product-form.component.css'],
})
export class UpdateProductFormComponent implements OnInit {
  brands: any[] = [];
  categories: any[] = [];
  prds:IfireBseProduct[]=[];
prdToUpdate: IfireBseProduct = {} as IfireBseProduct;
productForm:FormGroup;
  constructor(private firebase: FirebasePrdService,private router:Router, private dialogRf:MatDialogRef<UpdateProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data :IfireBseProduct,
    private fb: FormBuilder,
    ) {
      this.productForm = this.fb.group({
        id: ['', [Validators.required]],
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        brands: ['', [Validators.required]],
        brandSlug: ['', [Validators.required]],
        price: ['', [Validators.required]],
        priceAfterDiscount: [''],
        quantity: ['', [Validators.required]],
        categories: ['', [Validators.required]],
        categorySlug: ['', [Validators.required]],
        ratingsAverage: ['', [Validators.required]],
        ratingsQuantity: ['', [Validators.required]],
        createTime: ['', [Validators.required]],
        updateTime: ['', [Validators.required]],
      });
      
    
    this.prdToUpdate = {
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
  getProducts(){
    this.firebase.getProducts().subscribe({
      next: (data) => {
        // Map Firestore documents to IfireBseProduct interface
        this.prds = data.map((documentData: any) => {
          return {
            brand: documentData.brand,
            category: documentData.category,
            createdAt: documentData.createdAt,
            description: documentData.description,
            id: documentData.id,
            imageCover: documentData.imageCover,
            images: documentData.images,
            price: documentData.price,
            priceAfterDiscount: documentData.priceAfterDiscount,
            quantity: documentData.quantity,
            ratingsAverage: documentData.ratingsAverage,
            ratingsQuantity: documentData.ratingsQuantity,
            slug: documentData.slug,
            sold: documentData.sold,
            subcategory: documentData.subcategory,
            title: documentData.title,
            updatedAt: documentData.updatedAt,
          };
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updatePeoduct(){
    this.firebase.updateProduct(this.productForm.value).then(
      (val:any)=>{
        this.router.navigate(['/products/level1.1']);
        this.dialogRf.close(true)
      }
    ).catch(
      (err=>{
        console.log(err);
        
      })
    )
  }
  
  getBrands() {
    this.firebase.getBrands().subscribe({
      next: (data) => {
        console.log(data);
        this.brands = data.map((documentData: any) => {
          return {
            name: documentData.name,
            slug: documentData.slug,
            image: documentData.image,
            _id: documentData._id,
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategories() {
    this.firebase.getCtaegories().subscribe({
      next: (data) => {
        this.categories = data.map((documentData: any) => {
          return {
            name: documentData.name,
            slug: documentData.slug,
            image: documentData.image,
            _id: documentData._id,
          };
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    this.getBrands();
    this.getCategories();
  
    // Convert date strings to Date objects
    const createdAt = new Date(this.data.createdAt);
    const updatedAt = new Date(this.data.updatedAt);
  
    this.productForm.patchValue({
      ...this.data,
      createTime: createdAt,
      updateTime: updatedAt,
    });
  }
  
}