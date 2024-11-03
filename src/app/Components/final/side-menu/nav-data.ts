import { RouterLink } from '@angular/router';
import { InavbarData } from './helper';

export const navbarData: InavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fas fa-home',
    label: 'Dashboard',
  },
  {
    routeLink: 'products',
    icon: 'fas fa-box',
    label: 'Products',
  },
  {
    routeLink: 'statistics',
    icon: 'fas fa-chart-bar',
    label: 'Analytics Website',
  },
  {
    routeLink: 'users/customers',
    icon: 'fas fa-users',
    label: 'Users',
    expanded: true,
    defaultRoute: 'users/customers',
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
    icon: 'fas fa-clipboard-list',
    label: 'Orders',
  },
  {
    routeLink: 'media',
    icon: 'fas fa-store',
    label: 'Online Selling',
  },
  {
    routeLink: 'settings/profile',
    icon: 'fas fa-sliders-h',
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
