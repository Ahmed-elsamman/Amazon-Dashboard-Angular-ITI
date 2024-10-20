import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './products-list/products-list.component';

const routes: Routes = [
  {
    path: 'level1.1',
    component: ProductsComponent
  },
  {
    path: 'level1.2',
    component: ProductsListComponent
  }
  ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }