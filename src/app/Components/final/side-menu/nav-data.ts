import { RouterLink } from "@angular/router";
import { InavbarData } from "./helper";

export const navbarData: InavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
  },
  {
    routeLink: 'products',
    icon: 'fal fa-box-open',
    label: 'Products',
    items: [
      {
        routeLink: 'products/level1.1',
        label: 'Level1.1',
        // items: [
        //   {
        //     routeLink: 'products/level2.1',
        //     label: 'Level2.1',
        //   },
        //   {
        //     routeLink: 'products/level2.2',
        //     label: 'Level2.2',
        //     items: [
        //       {
        //         routeLink: 'products/level3.1',
        //         label: 'Level3.1',
        //       },
        //       {
        //         routeLink: 'products/level3.2',
        //         label: 'Level3.2',
        //       }
        //     ]
        //   }
        // ],
      },
      {
        routeLink: 'products/level1.2',
        label: 'Level1.2',
      },
    ]
  },
  {
    routeLink: 'statistics',
    icon: 'fal fa-chart-bar',
    label: 'Statistics',
  },
  {
    routeLink: 'users/users',
    icon: 'fal fa-users',
    label: 'Users',
    expanded: false,
  },
  {
    routeLink: 'media',
    icon: 'fal fa-camera',
    label: 'Media',
  },
  {
    routeLink: 'settings',
    icon: 'fal fa-cog',
    label: 'Settings',
    expanded: true,
    items: [
      {
        routeLink: 'settings/profile',
        label: 'Profile',
      },
      {
        routeLink: 'settings/customize',
        label: 'Customize',
      },

    ]
  },
]
