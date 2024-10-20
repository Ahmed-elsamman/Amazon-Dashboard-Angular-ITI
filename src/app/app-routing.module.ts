import { UsersModule } from './Components/final/users/users.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ParentCComponent } from './Components/parent-c/parent-c.component';
import { ProductsComponent } from './Components/products/products.component';
// import { AboutComponent } from './Components/about/about.component';
// import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { DetailsComponent } from './Components/details/details.component';
// import { CategoryComponent } from './Components/category/category.component';
// import { CatDetailsComponent } from './Components/cat-details/cat-details.component';
// import { UserAuthComponent } from './Components/user-auth/user-auth.component';
// import { userGuard } from './Guard/user.guard';
// import { ReactiveFormComponent } from './Components/Admin/reactive-form/reactive-form.component';
// import { UserTemplateDrivenFormComponent } from './Components/User/user-template-driven-form/user-template-driven-form.component';
// import { UserRactiveFormComponent } from './Components/User/user-ractive-form/user-ractive-form.component';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
import { MediaComponent } from './Components/final/media/media.component';
import { ProductUploadFormComponent } from './Components/product-upload-form/product-upload-form.component';
import { BestSellerComponent } from './Components/best-seller/best-seller.component';
import { UpdateProductFormComponent } from './Components/update-product-form/update-product-form.component';
import { userGuard } from './Guard/user.guard';
import { LoginComponent } from './login/login.component';
import { AddUserFormComponent } from './Components/add-user-form/add-user-form.component';

const routes: Routes = [
  // { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: 'dashboard', component: DashboardComponent, title: "dashboard",canActivate:[userGuard] },
  { path: 'login', component: LoginComponent, title: "Login"  },



  { path: 'statistics', component: StatisticsComponent, title: "statistics" , canActivate:[userGuard]},
  {
    path: 'users',
    loadChildren: () => import('./Components/final/users/users.module').then(m => m.UsersModule),
    canActivate:[userGuard]
  },
  { path: 'media', component: MediaComponent, title: "media" },

  {path:'bestseller',component: BestSellerComponent,title : 'bestseller', canActivate:[userGuard]},
  { path: 'updateprd/:id', component: UpdateProductFormComponent, title: "update" },

  {
    path: 'settings',
    loadChildren: () => import('./Components/final/settings/settings.module').then(m => m.SettingsModule),
  },

  // { path: "home", component: ParentCComponent, title: "Home Page" },
  // { path: "products", component: ProductsComponent, title: "products Page" },
  {
    path: "products",
    loadChildren: () => import('./Components/products/products.module').then(m => m.ProductsModule),
     canActivate:[userGuard]
  },
  {path : 'product-upload-form', component: ProductUploadFormComponent, title: "product-upload-form" , canActivate:[userGuard]},
  {path : 'user-upload-form', component: AddUserFormComponent, title: "user-upload-form" , canActivate:[userGuard]},

  // { path: "parent", component: ParentCComponent, title: "products-parent Page", canActivate: [userGuard] },
  // { path: "category", component: CategoryComponent, title: "category Page", canActivate: [userGuard] },
  // { path: "about", component: AboutComponent, title: "About-Us Page" },
  // { path: "contact", component: ContactUsComponent, title: "Contact-Us Page" },
  { path: "details/:id", component: DetailsComponent, title: "details" , canActivate:[userGuard] },
  // { path: "catdetails/:id", component: CatDetailsComponent, title: "Category details" },
  // { path: "admin/insertproduct", component: ReactiveFormComponent, title: "Add product" },
  // { path: 'edit-product/:id', component: ReactiveFormComponent, title: "Edit product" },
  // { path: 'delete-product/:id', component: ReactiveFormComponent, title: "Delete product" },
  // { path: "userLogin", component: UserAuthComponent, title: "User Login" },
  // { path: "userLogout", component: UserAuthComponent, title: "User Logout" },
  // { path: "userTemplate", component: UserTemplateDrivenFormComponent, title: "User Template Form Page" },
  // { path: "userReactive", component: UserRactiveFormComponent, title: "User Reactive Form Page" },
  // { path: "users", loadChildren: () => import('./Components/users/users.module').then(m => m.UsersModule) },
  { path: "**", component: NotFoundComponent, title: "NotFound Page" , canActivate:[userGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
