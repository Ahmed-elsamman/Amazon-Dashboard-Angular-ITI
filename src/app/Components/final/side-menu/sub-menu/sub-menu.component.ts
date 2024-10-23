import { Component, Input } from '@angular/core';
import { InavbarData, fadeInOut } from '../helper';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
        })
      ),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionParams}}'),
      ]),
      transition('void => *', animate(0)),
    ]),
  ],
})
export class SubMenuComponent {
  @Input() data: InavbarData = {
    routeLink: '',
    label: '',
    icon: '',
    items: [],
  };
  @Input() collapsed = false;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) {}

  handleClick(item: InavbarData): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let subItem of this.data.items) {
          if (subItem.expanded && subItem !== item) {
            subItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(item: InavbarData): string {
    return item.expanded && this.router.url.includes(item.routeLink)
      ? 'active-sub'
      : '';
  }
}
