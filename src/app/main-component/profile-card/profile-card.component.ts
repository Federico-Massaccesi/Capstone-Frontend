import { Component, Input, SimpleChanges } from '@angular/core';
import { iUser } from '../../Models/iUser';
import { AuthService } from '../../auth/auth.service';
import { CRUDService } from '../../CRUD.service';
import { IOrder } from '../../Models/i-order';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {

  @Input() user!: iUser;
  orders: IOrder[] = [];
  isOrdersCollapsed = true;


  isPrivateUser: boolean = false;
  isCompanyUser: boolean = false;

  constructor(private crudSvc: CRUDService){}

  ngOnInit() {
    if (this.user) {
      console.log('ngOnInit user:', this.user);
      this.checkRoles();
      this.loadOrders();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      console.log('ngOnChanges user:', changes['user'].currentValue);
      this.checkRoles();
      this.loadOrders();

    }
  }

  checkRoles() {
    if (this.user && this.user.roles) {
      this.isPrivateUser = this.user.roles.some(role => role.roleType === 'PRIVATE');
      this.isCompanyUser = this.user.roles.some(role => role.roleType === 'COMPANY');
    }
  }

  loadOrders() {
    if (this.user && this.user.id) {
      this.crudSvc.getUserOrders(this.user.id).subscribe((orders: IOrder[]) => {
        console.log(orders);

        this.orders = orders;
      });
    }
  }
}
