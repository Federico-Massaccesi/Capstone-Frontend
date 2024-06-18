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

    this.isUser = authSvc.getUserRole();


  }

}
