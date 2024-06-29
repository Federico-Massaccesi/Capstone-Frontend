import { Component } from '@angular/core';
import { IOrderRequest } from '../../../Models/i-order-request';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  clientId: number | null = null;
  cartList: any[] = [];
  totalPrice: number = 0;
  pending: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cartSvc: CartService,
    private authSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { clientId: number, cartList: any[], totalPrice: number };

    if (state) {
      this.clientId = state.clientId;
      this.cartList = state.cartList;
      this.totalPrice = state.totalPrice;
    }
  }

  processPayment(): void {
    if (this.clientId === null) {
      return;
    }

    const order: IOrderRequest = {
      clientId: this.clientId,
      products: this.cartList,
      totalPrice: this.totalPrice,
      pending: this.pending
    };

    this.cartSvc.createOrder(order).subscribe({
      next: (response) => {
        this.cartSvc.cleanCart();
        this.router.navigate(['/order-confirmation']); // Supponiamo che ci sia una pagina di conferma ordine
      }
    });
  }
}
