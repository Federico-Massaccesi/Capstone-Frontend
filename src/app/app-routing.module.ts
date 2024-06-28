import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './main-component/landing/landing.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { GuestGuard } from './auth/guest.guard';
import { AdminOrWarehouseGuard } from './auth/admin-or-warehouse.guard';
import { NotAuthorizedComponent } from './main-component/not-authorized/not-authorized.component';

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
  {
    path:'not-authorized',
    component:NotAuthorizedComponent
  },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard] },
  { path: 'userList', loadChildren: () => import('./pages/users-list/users-list.module').then(m => m.UsersListModule) ,
    canActivate:[AdminGuard],
    canActivateChild: [AdminGuard]
  },
  { path: 'productList', loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListModule),
    canActivate:[GuestGuard],
    canActivateChild:[GuestGuard]
   },
  { path: 'orderList', loadChildren: () => import('./pages/order-list/order-list.module').then(m => m.OrderListModule) ,
    canActivate:[AdminOrWarehouseGuard],
    canActivateChild: [AdminOrWarehouseGuard]
  },
  { path: 'profile/:id', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) ,
    canActivate:[AuthGuard],
    canActivateChild: [AuthGuard]
  },
  { path: 'product-details/:id', loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsModule),
    canActivate:[GuestGuard],
    canActivateChild:[GuestGuard]
   },
  { path: 'order-details/:id', loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsModule),
    canActivate:[AdminOrWarehouseGuard],
    canActivateChild: [AdminOrWarehouseGuard]
   },
  { path: 'user-details/:id', loadChildren: () => import('./pages/user-details/user-details.module').then(m => m.UserDetailsModule),
    canActivate:[AdminGuard],
    canActivateChild: [AdminGuard]
   },
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule),
    canActivate:[AuthGuard],
    canActivateChild: [AuthGuard]
   }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
