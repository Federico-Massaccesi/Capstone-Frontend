import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isUser!: boolean;
  userId!: number;

  constructor(private authSvc: AuthService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkUserRole();
    this.userId = this.authSvc.getUserId()!;
  }

  //DA FIXARE LO USER NON VEDE IL TASTO PROFILO
  checkUserRole() {
    const userRole = this.authSvc.getUserRole();
    if (userRole && userRole.some(role => role.roleType === 'PRIVATE' || role.roleType === 'COMPANY')) {
      this.isUser = true;
    } else {
      this.isUser = false;
    }
    console.log(this.isUser);
    this.cdr.detectChanges();
  }

}
