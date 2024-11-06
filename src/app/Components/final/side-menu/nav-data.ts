import { RouterLink } from '@angular/router';
import { InavbarData } from './helper';

export const navbarData: InavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fas fa-chart-line',
    label: 'Dashboard',
  },
  {
    routeLink: 'orders',
    icon: 'fas fa-file-invoice-dollar',
    label: 'Orders',
  },

  {
    routeLink: 'users/sellers',
    icon: 'fas fa-user-tie',
    label: 'Sellers',
  },

  {
    routeLink: 'users/customers',
    icon: 'fas fa-users',
    label: 'All Users',
  },

  {
    routeLink: 'products',
    icon: 'fas fa-box-open',
    label: 'Products',
  },
  {
    routeLink: 'media',
    icon: 'fas fa-store',
    label: 'Online Selling',
  },
];
