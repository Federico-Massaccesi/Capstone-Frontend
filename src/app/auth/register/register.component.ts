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
  registerData: Partial<iUser> = {}

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  signUp() {
    this.authSvc.register(this.registerData)
      .subscribe(data => {

        this.router.navigate(['/auth/login'])

      })
  }
}
