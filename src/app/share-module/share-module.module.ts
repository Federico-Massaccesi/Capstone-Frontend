import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../main-component/profile-card/profile-card.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ProfileCardComponent],
  imports: [CommonModule,RouterModule,NgbModule],
  exports: [ProfileCardComponent]
})
export class ShareModuleModule { }
