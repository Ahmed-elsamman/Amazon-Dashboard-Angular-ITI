import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/final/dashboard/dashboard.component';
import { StatisticsComponent } from './Components/final/statistics/statistics.component';
import { MediaComponent } from './Components/final/media/media.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { userGuard } from './Guard/user.guard';
import { ProductsComponentComponent } from './Components/products-component/products-component.component';
import { CustomersComponent } from './Components/users/customers/customers.component';
import { DispalyOfTableComponent } from './Components/dispaly-of-table/dispaly-of-table.component';
import { SellersComponent } from './Components/users/sellers/sellers.component';
import { OrdersComponent } from './Components/Orders/orders/orders.component';

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
    path: 'test',
    component: DispalyOfTableComponent,
    title: 'test',
  },

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
    component: SellersComponent, // استخدم المكون الجديد هنا
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
