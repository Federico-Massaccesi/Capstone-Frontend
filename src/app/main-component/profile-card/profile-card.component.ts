import { Router } from '@angular/router';
import { Component, Input, SimpleChanges } from '@angular/core';
import { iUser } from '../../Models/iUser';
import { CRUDService } from '../../CRUD.service';
import { IOrder } from '../../Models/i-order';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {

  @Input() user!: iUser;
  orders: IOrder[] = [];
  isOrdersCollapsed = true;
  isAdmin: boolean = false;


  isPrivateUser: boolean = false;
  isCompanyUser: boolean = false;

  constructor(private crudSvc: CRUDService, private authSvc: AuthService,private router: Router){}

  ngOnInit() {
    if (this.user) {
      console.log('ngOnInit user:', this.user);
      this.checkRoles();
      this.loadOrders();
      this.isAdmin = this.authSvc.getUserRole()!.some(role => role.roleType === 'ADMIN'); // Verifica se l'utente è admin

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
        this.orders = orders.map(order => {
          return {
            ...order,
            localDate: new Date(order.localDate)
          };
        });
      });
    }
  }

  getDateDifferenceInDays(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getOrderStatusClass(orderDate: Date): string {
    const currentDate = new Date();
    const diffDays = this.getDateDifferenceInDays(orderDate, currentDate);

    if (diffDays > 14) {
      return 'text-danger'; // rosso
    } else if (diffDays > 7) {
      return 'text-warning'; // giallo
    } else {
      return ''; // nessuna classe aggiuntiva
    }
  }

  navigateToPayment(orderId: number): void {
    this.router.navigate(['/cart/payment'], { queryParams: { orderId: orderId } });
  }
}
