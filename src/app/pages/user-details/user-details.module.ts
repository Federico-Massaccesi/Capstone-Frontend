import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailsRoutingModule } from './user-details-routing.module';
import { UserDetailsComponent } from './user-details.component';
import { ProfileCardComponent } from '../../main-component/profile-card/profile-card.component';


@NgModule({
  declarations: [
    UserDetailsComponent, ProfileCardComponent
  ],
  imports: [
    CommonModule,
    UserDetailsRoutingModule
  ]
})
export class UserDetailsModule { }
