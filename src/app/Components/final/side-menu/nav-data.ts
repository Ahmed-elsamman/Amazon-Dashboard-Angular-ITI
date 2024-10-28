import { RouterLink } from '@angular/router';
import { InavbarData } from './helper';

export const navbarData: InavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fas fa-tachometer-alt',
    label: 'Dashboard',
  },
  {
    routeLink: 'products',
    icon: 'fas fa-shopping-cart',
    label: 'Products',
  },
  {
    routeLink: 'statistics',
    icon: 'fas fa-chart-line',
    label: 'Analytics Website',
  },
  {
    routeLink: 'users/customers',
    icon: 'fas fa-user-friends',
    label: 'Users',
    expanded: true,
    items: [
      {
        routeLink: 'users/customers',
        label: 'Customers',
      },
      {
        routeLink: 'users/sellers',
        label: 'Sellers',
      },
    ],
  },
  {
    routeLink: 'orders',
    icon: 'fas fa-shopping-bag',
    label: 'Orders',
  },
  {
    routeLink: 'media',
    icon: 'fas fa-photo-video',
    label: 'Online Selling',
  },
  {
    routeLink: 'settings/profile',
    icon: 'fas fa-cogs',
    label: 'Settings',
    expanded: false,
    items: [
      {
        routeLink: 'settings/profile',
        label: 'Profile',
      },
      {
        routeLink: 'settings/customize',
        label: 'Customize',
      },
    ],
  },
];
