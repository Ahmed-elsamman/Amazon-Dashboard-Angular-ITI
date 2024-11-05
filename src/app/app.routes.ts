import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
import { MediaComponent } from './Components/final/media/media.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { userGuard } from './Guard/user.guard';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';
import { CustomersComponent } from './Components/users/customers/customers.component';

import { OrdersComponent } from './Components/Orders/orders/orders.component';
import { SellerComponent } from './Components/users/seller/seller.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';

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
    path: 'resetPassword',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    title: 'statistics',
    canActivate: [userGuard],
  },
  // {
  //   path: 'test',
  //   component: ,
  //   title: 'test',
  // },

  {
    path: 'media',
    component: MediaComponent,
    title: 'media',
  },

  {
    path: 'settings',
    loadChildren: () =>
      import('./Components/final/settings/settings-routing.module').then(
        (m) => m.SettingsRoutingModule
      ),
    title: 'settings',
  },

  {
    path: 'users/customers', // هذا هو المسار الجديد
    component: CustomersComponent, // استخدم المكون الجديد هنا
    title: 'Customers', // عنوان الصفحة
    canActivate: [userGuard], // إذا كان هناك حاجة للحماية
  },
  {
    path: 'users/sellers', // هذا هو المسار الجديد
    component: SellerComponent, // استخدم المكون الجديد هنا
    title: 'Sellers', // عنوان الصفحة
    canActivate: [userGuard], // إذا كان هناك حاجة للحماية
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Orders',
    canActivate: [userGuard],
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
