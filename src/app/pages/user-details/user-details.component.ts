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
    private userSvc: CRUDService<iUser>
  ){

  }

    ngOnInit(){

      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        const idNumber = Number(productId);
        this.userSvc.getOneEntity(this.userUrl, idNumber).subscribe((user: iUser) => {
          this.user = user;
          console.log(user);

        })
      }
    }
}
