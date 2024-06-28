import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isUser!:boolean;

  constructor(private authSvc : AuthService){

    if (this.authSvc.getUserRole()?.some(role => role.roleType === 'PRIVATE' || role.roleType === 'COMPANY')) {

    this.isUser = true

    } else {
      this.isUser = false
    }


  }

}
