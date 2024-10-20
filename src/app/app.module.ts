import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { UpdateProductFormComponent } from './Components/update-product-form/update-product-form.component';


// import { HeaderComponent } from './Components/header/header.component';
// import { ProductsComponent } from './Components/products/products.component';
// import { FooterComponent } from './Components/footer/footer.component';
import { SideMenuComponent } from './Components/final/side-menu/side-menu.component';
// import { NavigationBarComponent } from './Components/navigation-bar/navigation-bar.component';
import { FormsModule } from '@angular/forms';
// import { ProductCardDirective } from './Directives/product-card.directive';
// import { CreditCardPipe } from './Pipes/credit-card.pipe';
// import { ParentCComponent } from './Components/parent-c/parent-c.component';
// import { AboutComponent } from './Components/about/about.component';
// import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { DetailsComponent } from './Components/details/details.component';
import { HttpClientModule } from '@angular/common/http';
// import { CategoryComponent } from './Components/category/category.component';
// import { CatDetailsComponent } from './Components/cat-details/cat-details.component';
// import { UserAuthComponent } from './Components/user-auth/user-auth.component';
// import { ReactiveFormComponent } from './Components/Admin/reactive-form/reactive-form.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { UserTemplateDrivenFormComponent } from './Components/User/user-template-driven-form/user-template-driven-form.component';
// import { UserRactiveFormComponent } from './Components/User/user-ractive-form/user-ractive-form.component';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
// import { SubproductsComponent } from './Components/final/subproducts/subproducts.component';
import { PagesComponent } from './Components/final/pages/pages.component';
import { MediaComponent } from './Components/final/media/media.component';
import { BodyComponent } from './Components/final/body/body.component';
import { SubmenuComponent } from './Components/final/side-menu/submenu.component';
import { HeaderComponent } from './Components/header/header.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ProductUploadFormComponent } from './Components/product-upload-form/product-upload-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from './Components/header/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Dialog2Component } from './Components/header/dialog2/dialog2.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressBarModule} from '@angular/material/progress-bar';
/* --------------------------------------------------------- */

import { BestSellerComponent } from './Components/best-seller/best-seller.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button'; // Import other necessary modules if required
import { TagModule } from 'primeng/tag';
import { AppComponent } from './app.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
/* --------------------------------------------------------- */
import { ToastrModule } from 'ngx-toastr';
import { UpdateUserFormComponent } from './Components/update-user-form/update-user-form.component';
import { AddUserFormComponent } from './Components/add-user-form/add-user-form.component';
import { KakComponent } from './Components/kak/kak.component';


const firebaseConfig = {
  apiKey: "AIzaSyDDYcZV0eHYZ3lIQfZi--vZJgfYJeDaFx4",
  authDomain: "fir-88026.firebaseapp.com",
  projectId: "fir-88026",
  storageBucket: "fir-88026.appspot.com",
  messagingSenderId: "947539259472",
  appId: "1:947539259472:web:f1f9925e12528cdfe92155"
};


@NgModule({
  declarations: [
    AppComponent,
    UpdateProductFormComponent,
    LoginComponent,
    HeaderComponent,
    // ProductsComponent,
    // FooterComponent,
    SideMenuComponent,
    // NavigationBarComponent,
    // ProductCardDirective,
    // CreditCardPipe,
    // ParentCComponent,
    // AboutComponent,
    // ContactUsComponent,
    NotFoundComponent,
    DetailsComponent,
    // CategoryComponent,
    // CatDetailsComponent,
    // UserAuthComponent,
    // ReactiveFormComponent,
    // UserTemplateDrivenFormComponent,
    // UserRactiveFormComponent,
    DashboardComponent,
    StatisticsComponent,
    // SubproductsComponent,
    PagesComponent,
    MediaComponent,
    BodyComponent,
    SubmenuComponent,
    HeaderComponent,
    ProductUploadFormComponent,
    DialogComponent,
    Dialog2Component,
    BestSellerComponent,
    UpdateUserFormComponent,
    AddUserFormComponent,
    KakComponent,
  ],
  imports: [
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxSpinnerModule.forRoot({ type: 'square-jelly-box' }),
    MatTableModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),


    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,

    OverlayModule,
    CdkMenuModule,
    CanvasJSAngularChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressBarModule,
/* --------------------------------------------------------- */

    CarouselModule,
    ButtonModule,
    TagModule,
/* --------------------------------------------------------- */
ToastrModule.forRoot( {
  timeOut:1100,
  progressBar:true,
  progressAnimation:'increasing',
  positionClass: 'toast-top-center',
  closeButton:true,
  maxOpened:2,


  preventDuplicates: true

}),


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
