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
    private userSvc: CRUDService<iUser>
  ){

  }

  ngOnInit() {
    this.userSvc.getAllEntities(this.userUrl).subscribe(users => {
      this.userList = users.filter(user =>
        user.roles.some(role => role.roleType === 'COMPANY' || role.roleType === 'PRIVATE')
      );
      console.log(this.userList);
    });

    this.userSvc.items$.subscribe((r) => {
      this.userList = r.filter(user =>
        user.roles.some(role => role.roleType === 'COMPANY' || role.roleType === 'PRIVATE')
      );
    });
  }

  hasRole(roles: any[], roleType: string): boolean {
    return roles.some(role => role.roleType === roleType);
  }

  getPivaType(user: iUser): string {
    return user.pIVA ? typeof user.pIVA : 'undefined';
  }
}
