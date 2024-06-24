import { Component, Input } from '@angular/core';
import { iUser } from '../../Models/iUser';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {

  @Input() user!:iUser

hasRole(roles: any[], roleType: string): boolean {
  return roles.some(role => role.roleType === roleType);
}

  }
