import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './main-component/landing/landing.component';

const routes: Routes = [
  {
     path: 'auth',
      loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path:'',
    component:LandingComponent
  },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'userList', loadChildren: () => import('./pages/users-list/users-list.module').then(m => m.UsersListModule) },
  { path: 'productList', loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListModule) },
  { path: 'orderList', loadChildren: () => import('./pages/order-list/order-list.module').then(m => m.OrderListModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
