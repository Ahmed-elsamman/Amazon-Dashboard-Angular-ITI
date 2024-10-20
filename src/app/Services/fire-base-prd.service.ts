import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { IfireBseProduct } from '../Models/ifire-base-prd';
import { Observable, map } from 'rxjs';
import { IfirebaseUsers } from '../Models/ifirebase-users';

@Injectable({
  providedIn: 'root'
})
export class FirebasePrdService {
  products: IfireBseProduct[] = [];
  onFilterChange: EventEmitter<void> = new EventEmitter<void>();

  constructor(private fsObject: Firestore) { }
  getProducts() {
    const products = collection(this.fsObject, 'products');
    return collectionData(products, { idField: 'id' });
  }
  getProductById(id: string) {
    const product = doc(this.fsObject, 'products', id);
    console.log(product);

    return getDoc(product);
  }


  addProduct(product: IfireBseProduct) {
    return addDoc(collection(this.fsObject, 'products'), product);
  }

  updateProduct(product: IfireBseProduct) {
    const productObject = { ...product };
    const prdRef = doc(this.fsObject, 'products', product.id);
    alert("Product Updated Successfully");
    return updateDoc(prdRef, productObject);
  }
  async deleteProduct(_id: string) {
    const prdRef = doc(this.fsObject, 'products', _id);

    try {
      await deleteDoc(prdRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
  
  getBrands() {
    const brands = collection(this.fsObject, 'brands');
    return collectionData(brands, { idField: 'id' });
  }

  getCtaegories() {
    const categories = collection(this.fsObject, 'categories');
    return collectionData(categories, { idField: 'id' });
  }

  getSubCategories() {
    const subCategories = collection(this.fsObject, 'sub-categories');
    return collectionData(subCategories, { idField: 'id' });
  }

  getOrders() {
    const order = collection(this.fsObject, 'orders');
    return collectionData(order, { idField: 'id' });
  }

  getUsers() {
    const users = collection(this.fsObject, 'users');
    return collectionData(users, { idField: 'id' });
  }

  getUserById(id: string) {
    const user = doc(this.fsObject, 'users', id);
    return getDoc(user);
  }

  addUser(user: IfirebaseUsers) {
    return addDoc(collection(this.fsObject, 'users'), user);
  }

  updateUser(user: IfirebaseUsers) {
    const userObject = { ...user };
    const userRef = doc(this.fsObject, 'users', user.id);
    return updateDoc(userRef, userObject);
  }

  async deleteUser(_id: string) {
    const userRef = doc(this.fsObject, 'users', _id);

    try {
      await deleteDoc(userRef);
      console.log('User successfully deleted!');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  //////////////////////////////////////////////////////////////


  getBestSellers(): Observable<IfireBseProduct[]> {
    const productsCollection = collection(this.fsObject, 'products');
    const soldQuery = query(productsCollection, where('sold', '>', 900));

    return collectionData(soldQuery, { idField: 'id' }).pipe(
      map((data: any[]) => {
        // Filter products with sold greater than 300
        const filteredData = data.filter(productData => productData.sold > 900);

        // Map Firestore documents to IfireBseProduct interface
        return filteredData.map((documentData: any) => {
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
            _id: documentData._id
          } as IfireBseProduct;
        });
      })
    );
  } ;


  getDisCount(): Observable<IfireBseProduct[]> {
    const productsCollection = collection(this.fsObject, 'products');
    const priceAfterDiscountQuery = query(productsCollection, where('priceAfterDiscount', '>', 0)); // Assuming priceAfterDiscount is always greater than 0

    return collectionData(priceAfterDiscountQuery, { idField: 'id' }).pipe(
      map((data: any[]) => {
        // Filter products with priceAfterDiscount greater than 0
        const filteredData = data.filter(productData => productData.priceAfterDiscount > 0);

        // Map Firestore documents to IfireBseProduct interface
        return filteredData.map((documentData: any) => {
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
            _id: documentData._id
          } as IfireBseProduct;
        });
      })
    );
  }


  // ////////////////////////////////////////////////////////////////

  filterProducts(value: string): void {
    this.getProducts().subscribe({
      next: (data: any) => { // Replace 'any' with the actual type of your Firestore document if available
        // Map Firestore documents to IfireBseProduct interface
        this.products = data.map((documentData: any) => {
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
            _id: documentData._id
          } as IfireBseProduct;
        });

        this.onFilterChange.emit();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  PerformSearch(val: string): IfireBseProduct[] {
    val = val.toLowerCase();
    return this.products.filter(product => product.title.toLowerCase().includes(val));
  }
}
