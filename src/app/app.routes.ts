import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
import { MediaComponent } from './Components/final/media/media.component';
import { ProductUploadFormComponent } from './Components/product-upload-form/product-upload-form.component';
import { BestSellerComponent } from './Components/best-seller/best-seller.component';
import { UpdateProductFormComponent } from './Components/update-product-form/update-product-form.component';
import { LoginComponent } from './login/login.component';
import { AddUserFormComponent } from './Components/add-user-form/add-user-form.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { userGuard } from './Guard/user.guard';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'dashboard',
    canActivate: [userGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    title: 'statistics',
    canActivate: [userGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./Components/final/users/users-routing.module').then(
        (m) => m.UsersRoutingModule
      ),
    canActivate: [userGuard],
  },
  {
    path: 'media',
    component: MediaComponent,
    title: 'media',
  },
  {
    path: 'bestseller',
    component: BestSellerComponent,
    title: 'bestseller',
    canActivate: [userGuard],
  },
  {
    path: 'updateprd/:id',
    component: UpdateProductFormComponent,
    title: 'update',
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./Components/final/settings/settings-routing.module').then(
        (m) => m.SettingsRoutingModule
      ),
    title: 'settings',
  },

  // {
  //   path: 'products',
  //   loadChildren: () =>
  //     import('./Components/products/products-routing.module').then(
  //       (m) => m.ProductsRoutingModule
  //     ),
  //   canActivate: [userGuard],
  // },

  {
    path: 'products', // هذا هو المسار الجديد
    component: ProductsComponentComponent, // استخدم المكون الجديد هنا
    title: 'Products', // عنوان الصفحة
    canActivate: [userGuard], // إذا كان هناك حاجة للحماية
  },
  {
    path: 'product-upload-form',
    component: ProductUploadFormComponent,
    title: 'product-upload-form',
    canActivate: [userGuard],
  },
  {
    path: 'user-upload-form',
    component: AddUserFormComponent,
    title: 'user-upload-form',
    canActivate: [userGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
