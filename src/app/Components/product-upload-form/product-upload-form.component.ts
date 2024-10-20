import { Component, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL  } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { IfireBseProduct } from 'src/app/Models/ifire-base-prd';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';

@Component({
  selector: 'app-product-upload-form',
  templateUrl: './product-upload-form.component.html',
  styleUrls: ['./product-upload-form.component.css']
})
export class ProductUploadFormComponent {
  prdToAdd: IfireBseProduct = {} as IfireBseProduct;
  prds:IfireBseProduct[]=[];
  brands: any[] = [];
  categories: any[] = [];
  isUpdate: boolean = false;
  brandImageUrl:string ='';
  categoryImageUrl:string ='';
  coverImageUrl:string ='';
  ImagesUrls:string[] =[];
  subCategories: any[] = [];
  
  constructor(private fireBase:FirebasePrdService, private router: Router, private storage:Storage ) { 
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

  getSubCategories(){
    this.fireBase.getSubCategories().subscribe({
      next:(data)=>{
        this.subCategories=data.map((documentData:any)=>{
          return{
            name:documentData.name,
            slug:documentData.slug,
            image:documentData.image,
            _id:documentData._id,
            createdAt:documentData.createdAt,
            updatedAt:documentData.updatedAt,
          }
        })
      } 
    })
  };

  getProducts(){
    this.fireBase.getProducts().subscribe({
      next: (data) => {
        // console.log(data);
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
            // _id: documentData._id
          };
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getBrands(){
    this.fireBase.getBrands().subscribe({
      next: (data) => {
        console.log(data);
        
        this.brands = data.map((documentData: any) => {
          return {
            name: documentData.name,
            slug: documentData.slug,
            image: documentData.image,
            _id: documentData._id
          };
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getCtaegories(){
    this.fireBase.getCtaegories().subscribe({
      next:(data)=>{
        this.categories=data.map((documentData:any)=>{
          return{
            name:documentData.name,
            slug:documentData.slug,
            image:documentData.image,
            _id:documentData._id
          }
        })
      }
    })
  };

  async uploadImageCover(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const filenames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, `coverImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Store the download URL of the brand image
        this.coverImageUrl = downloadURL;

        // Track filenames for future use
        filenames.push(file.name);
      }
    }
  }
  async uploadBrandImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const filenames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, `brandsImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Store the download URL of the brand image
        this.brandImageUrl = downloadURL;

        // Track filenames for future use
        filenames.push(file.name);
      }
    }
  }
  async uploadCategoryImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const filenames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, `categoriesImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Store the download URL of the brand image
        this.categoryImageUrl = downloadURL;

        // Track filenames for future use
        filenames.push(file.name);
      }
    }
  }
  async uploadProductImages(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const filenames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, `ProductsImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Store the download URL of the brand image
        this.ImagesUrls.push(downloadURL) ;

        // Track filenames for future use
        filenames.push(file.name);
      }
    }
  }
  

  addProduct(){
    this.prdToAdd.imageCover = this.coverImageUrl;
    this.prdToAdd.brand.image = this.brandImageUrl;
    this.prdToAdd.category.image = this.categoryImageUrl;
    this.prdToAdd.images = this.ImagesUrls;
    this.fireBase.addProduct(this.prdToAdd);
    alert('Product Added Successfully');
    this.router.navigate(['/products/level1.1']);
    this.getProducts();
  }
  updateProduct(){
    this.fireBase.updateProduct(this.prdToAdd);
  }
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getCtaegories()
    this.getSubCategories();
  }
}

