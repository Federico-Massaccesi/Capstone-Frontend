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
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
