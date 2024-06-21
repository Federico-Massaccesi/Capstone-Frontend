import { ProductCardComponent } from './../../main-component/product-card/product-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductListComponent,ProductCardComponent
  ],
  imports: [
    CommonModule,
    ProductListRoutingModule,
    FormsModule
  ]
})
export class ProductListModule { }
