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

  userId: number | undefined;
  userName$ = new BehaviorSubject<string | null>(null);
  isUser$ = new BehaviorSubject<boolean>(false);

  constructor(private authSvc: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authSvc.user$.subscribe(userInfo => {
      if (userInfo) {
        this.userId = userInfo.id;
        this.userName$.next(userInfo.username);
        this.isUser$.next(true);
      } else {
        this.userName$.next(null);
        this.isUser$.next(false);
      }
      this.cdr.detectChanges();
    });
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
