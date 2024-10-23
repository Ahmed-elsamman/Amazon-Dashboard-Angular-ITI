import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { CustomizeComponent } from './customize/customize.component';

const SETTINGS_ROUTES: Routes = [
  {
    path: 'profile',
    component: SettingsComponent,
  },
  {
    path: 'customize',
    component: CustomizeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(SETTINGS_ROUTES)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
