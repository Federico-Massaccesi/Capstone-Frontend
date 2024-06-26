import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CRUDService } from '../../CRUD.service';
import { iUser } from '../../Models/iUser';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  userUrl:string = environment.usersUrl;

  user!:iUser

  constructor(
    private route: ActivatedRoute,
    private userSvc: CRUDService
  ){

  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const idNumber = Number(userId);
      this.userSvc.getOneEntity(this.userUrl, idNumber, 'user').subscribe((user: iUser) => {
        this.user = user;
        console.log(user);
      });
    }
  }
}
