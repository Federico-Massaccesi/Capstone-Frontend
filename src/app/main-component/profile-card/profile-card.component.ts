import { Component, Input, SimpleChanges } from '@angular/core';
import { iUser } from '../../Models/iUser';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {

  @Input() user!: iUser;

  isPrivateUser: boolean = false;
  isCompanyUser: boolean = false;

  ngOnInit() {
    if (this.user) {
      console.log('ngOnInit user:', this.user);
      this.checkRoles();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      console.log('ngOnChanges user:', changes['user'].currentValue);
      this.checkRoles();
    }
  }

  checkRoles() {
    if (this.user && this.user.roles) {
      this.isPrivateUser = this.user.roles.some(role => role.roleType === 'PRIVATE');
      this.isCompanyUser = this.user.roles.some(role => role.roleType === 'COMPANY');
    }
}
}
