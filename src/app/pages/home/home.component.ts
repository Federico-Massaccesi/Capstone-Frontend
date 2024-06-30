import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUser } from '../../Models/iUser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isUser$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<iUser | null>(null);
  userId!: number | null;

  constructor(private authSvc: AuthService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.userId = this.authSvc.getUserId();
    this.user$.next(this.authSvc.getUserInfo());
    this.checkUserRole();
  }

  //DA FIXARE LO USER NON VEDE IL TASTO PROFILO
  checkUserRole() {
    const roles = this.authSvc.getUserRole();
    if (roles && roles.some(role => role.roleType === 'PRIVATE' || role.roleType === 'COMPANY')) {
      this.isUser$.next(true);
    } else {
      this.isUser$.next(false);
    }
    this.cdr.detectChanges();
  }

}
