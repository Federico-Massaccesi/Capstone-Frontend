import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iUser } from '../../Models/iUser';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user!: iUser;


  constructor(private route: ActivatedRoute,
    private crudService: CRUDService
    ){}

    ngOnInit(): void {
      const userId = +this.route.snapshot.paramMap.get('id')!;
      this.crudService.getOneEntity(environment.usersUrl, userId, 'user')
        .subscribe((user: iUser) => {
          this.user = user;
        });
    }

}
