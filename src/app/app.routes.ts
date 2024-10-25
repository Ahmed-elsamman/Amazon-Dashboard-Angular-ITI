import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
import { MediaComponent } from './Components/final/media/media.component';
import { BestSellerComponent } from './Components/best-seller/best-seller.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { userGuard } from './Guard/user.guard';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';
import { CustomersComponent } from './Components/users/customers/customers.component';

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
    path: 'users/customers', // هذا هو المسار الجديد
    component: CustomersComponent, // استخدم المكون الجديد هنا
    title: 'Customers', // عنوان الصفحة
    canActivate: [userGuard], // إذا كان هناك حاجة للحماية
  },
  {
    path: 'products', // هذا هو المسار الجديد
    component: ProductsComponentComponent, // استخدم المكون الجديد هنا
    title: 'Products', // عنوان الصفحة
    canActivate: [userGuard], // إذا كان هناك حاجة للحماية
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];
