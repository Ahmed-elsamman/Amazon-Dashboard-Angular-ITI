import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const USER_ROUTES: Routes = [
  {
    path: '', // تم تغيير المسار من 'users' إلى ''
    component: UsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
