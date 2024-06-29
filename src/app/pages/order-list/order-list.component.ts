import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IOrder } from '../../Models/i-order';
import { CRUDService } from '../../CRUD.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { iRole } from '../../Models/iUser';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  orders$: Observable<IOrder[]> = this.crudService.orderItems$;
  filteredOrders$: BehaviorSubject<IOrder[]> = new BehaviorSubject<IOrder[]>([]);
  userRoles: iRole[] | undefined;
  isAdmin: boolean = false;


  constructor(private crudService: CRUDService,
    private router :Router,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.userRoles = this.authSvc.getUserRole();
    this.isAdmin = this.userRoles?.some(role => role.roleType === 'ADMIN') || false;

    this.crudService.getAllEntities(environment.ordersUrl, 'order').subscribe(() => {
      this.orders$.subscribe(orders => {
        const uncheckedOrders = orders.filter(order => !order.checked);
        if (uncheckedOrders.length > 0) {
          this.filteredOrders$.next(uncheckedOrders);
        } else {
          this.setFilter('incomplete');
        }
      });
    });
    console.log(this.orders$);

  }

  markAsChecked(orderId: number): void {
    this.crudService.patchOrderChecked(environment.ordersUrl, orderId, true).subscribe();
  }

  deleteOrder(orderId: number): void {
    this.crudService.deleteEntity(environment.ordersUrl, orderId, 'order').subscribe();
  }

  setFilter(filter: string): void {
    this.orders$.pipe(
      map(orders => {
        switch (filter) {
          case 'completed':
            return orders.filter(order => !order.pending);
          case 'incomplete':
            return orders.filter(order => order.pending);
          default:
            return orders;
        }
      })
    ).subscribe(filtered => this.filteredOrders$.next(filtered));
  }

  viewOrderDetails(orderId: number, checked: boolean): void {
    const isWarehouse = this.userRoles?.some(role => role.roleType === 'WAREHOUSE');
    if (isWarehouse && !checked) {
      this.crudService.patchOrderChecked(environment.ordersUrl, orderId, true).subscribe(() => {
        this.router.navigate(['/order-details', orderId]);
      });
    } else {
      this.router.navigate(['/order-details', orderId]);
    }
  }
}
