import { Component, Input, OnInit } from '@angular/core';
import { InavbarData, fadeInOut } from '../side-menu/helper';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submenu',
  template: `
  <ul *ngIf='collapsed && data.items && data.items.length > 0 ' [@submenu]="expanded ? {value: 'visible',
  params: {transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)', height:'*' }}
    : {value:'hidden', params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)', height:'0'}}" class="sub">
<li *ngFor="let item of data.items" class="sub-item">
  <a *ngIf="item.items && item.items.length > 0 " [ngClass]="getActiveClass(item)" class="sub-link" (click)="handleClick(item)">
    <i class="sub-link-icon fa fa-circle"></i>
    <span class="sub-link-text" @fadeInOut *ngIf="collapsed">
      {{item.label}}
    </span>
    <i *ngIf="item.items && collapsed " class="menu-collapse-icon"
      [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
  </a>
  <a class="sub-link" *ngIf="!item.items || (item.items && item.items.length === 0) "
    [routerLink]="[item.routeLink]" routerLinkActive="active-sub" [routerLinkActiveOptions]="{exact: true}">
    <i class="sub-link-icon fa fa-circle"></i>
    <span class="sub-link-text" @fadeInOut *ngIf="collapsed">
      {{item.label}}
    </span>
  </a>
  <div *ngIf="item.items && item.items.length > 0 ">
  <app-submenu [data]="item" [collapsed]="collapsed" [expanded]="item.expanded" [multiple]="multiple">
  </app-submenu>
</div>

</li>
</ul>

  `,
  styleUrls: ['./side-menu.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden',
      })),
      state('visible', style({
        height: '*',
      })),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
      transition('void => *', animate(0)),
    ])
  ]
})
export class SubmenuComponent implements OnInit {
  @Input() data: InavbarData = {
    routeLink: '',
    label: '',
    icon: '',
    items: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router ) { }

  ngOnInit(): void {
    console.log('SideMenuComponent initialized with data:', this.data);
    console.log('collapsed:', this.collapsed);
    console.log('expanded:', this.expanded);
    console.log('multiple:', this.multiple);
  }

  handleClick(item: InavbarData): void {
    console.log('SubmenuComponent handleClick called');

    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let subItem of this.data.items) {
          if (subItem.expanded && subItem !== item) {
            subItem.expanded = false;
            console.log('SubmenuComponent subItem.expanded set to false');
          }
        }
      }
    }

    item.expanded = !item.expanded;
    console.log('SubmenuComponent item.expanded state:', item.expanded);
  }

  getActiveClass(item: InavbarData): string {
    return item.expanded && this.router.url.includes(item.routeLink) ? 'active-sub' : '';
  }

}
