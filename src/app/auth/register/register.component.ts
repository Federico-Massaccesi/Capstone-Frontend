import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iUser } from '../../Models/iUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData: Partial<iUser> = {
    roles : []
  }

  privateOrCompany:boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  signUp() {

    if(this.privateOrCompany == false){
      this.registerData.roles?.push({roleType:"PRIVATE"})
    }else{
      this.registerData.roles?.push({roleType:"COMPANY"})
    }

    this.authSvc.register(this.registerData)
      .subscribe(data => {

        this.router.navigate(['/auth/login'])

      })
  }
}
