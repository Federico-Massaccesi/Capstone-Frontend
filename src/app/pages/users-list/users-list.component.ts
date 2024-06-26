import { Component } from '@angular/core';
import { iUser } from '../../Models/iUser';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  userList!:iUser[]

  userUrl:string = environment.usersUrl;

  constructor(
    private userSvc: CRUDService
  ){

  }

  ngOnInit(): void {
    this.userSvc.getAllEntities(this.userUrl, 'user').subscribe((users: iUser[]) => {
      this.userList = users.filter((user: iUser) =>
        user.roles.some((role: { roleType: string }) => role.roleType === 'COMPANY' || role.roleType === 'PRIVATE')
      );
    });

    this.userSvc.userItems$.subscribe((users: iUser[]) => {
      this.userList = users.filter((user: iUser) =>
        user.roles.some((role: { roleType: string }) => role.roleType === 'COMPANY' || role.roleType === 'PRIVATE')
      );
    });
  }


  hasRole(roles: any[], roleType: string): boolean {
    return roles.some(role => role.roleType === roleType);
  }

}
