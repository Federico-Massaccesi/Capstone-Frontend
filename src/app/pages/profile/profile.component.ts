import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iRole, iUser } from '../../Models/iUser';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user!: iUser;
  isAdmin!: boolean;
  isPrivateUser!: boolean;
  isCompanyUser!: boolean;

  constructor(private route: ActivatedRoute,
    private crudService: CRUDService,
    private authSvc : AuthService
    ){}

    ngOnInit(): void {
      const userId = +this.route.snapshot.paramMap.get('id')!;
      this.crudService.getOneEntity(environment.usersUrl, userId, 'user')
        .subscribe((user: iUser) => {
          this.user = user;
          this.checkRoles()
        });
    }

    checkRoles() {
      const roles: iRole[] | undefined = this.authSvc.getUserRole();
      if (roles) {
        this.isPrivateUser = roles.some(role => role.roleType === 'PRIVATE');
        this.isCompanyUser = roles.some(role => role.roleType === 'COMPANY');
        this.isAdmin = roles.some(role => role.roleType === 'ADMIN');
      }
    }
}
