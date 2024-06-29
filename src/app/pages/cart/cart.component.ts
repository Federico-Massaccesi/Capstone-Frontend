import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { iCartItem } from '../../Models/cart-item';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { IOrderRequest } from '../../Models/i-order-request';
import { iRole } from '../../Models/iUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartList: iCartItem[] = []
  totalPrice: number = 0;
  private cartSubscription!: Subscription;
  private userRoles: iRole[] | undefined;
  isCompanyUser: boolean = false;
  payLater: boolean = false;


  constructor(private cartSvc: CartService
    ,private authSvc: AuthService,
  private router:Router) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartSvc.cart$.subscribe(cart => {
      this.cartList = cart;
      this.updateTotalPrice();

      this.userRoles = this.authSvc.getUserRole();
    this.isCompanyUser = this.userRoles?.some(role => role.roleType === 'COMPANY') || false;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateTotalPrice(): void {
    this.totalPrice = this.cartSvc.getTotalPrice();
  }

  incrementQuantity(item: iCartItem): void {
    item.quantity++;
    this.cartSvc.addProductToCart(item.product, item.quantity);
    this.updateTotalPrice();
  }

  decrementQuantity(item: iCartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartSvc.addProductToCart(item.product, item.quantity);
    } else {
      this.removeFromCart(item);
    }
    this.updateTotalPrice();
  }

  removeFromCart(item: iCartItem): void {
    this.cartSvc.removeProductFromCart(item.product);
    this.updateTotalPrice();
  }

  createOrder(): void {
    const clientId = this.authSvc.getUserId();
    if (clientId === null) {
      return;
    }

    if (this.userRoles?.some(role => role.roleType === 'PRIVATE')) {
      this.router.navigate(['/cart/payment'], { state: { clientId, cartList: this.cartList, totalPrice: this.totalPrice, pending: false } });
    } else if (this.isCompanyUser) {
      if (this.payLater) {
        const order: IOrderRequest = {
          clientId: clientId,
          products: this.cartList,
          totalPrice: this.totalPrice,
          pending: true  // Imposta pending su true se l'utente ha selezionato "Vuoi pagare in futuro?"
        };

        this.cartSvc.createOrder(order).subscribe({
          next: (response) => {
            this.cartSvc.cleanCart();
            this.router.navigate(['/home']); // Reindirizza alla home dopo aver creato l'ordine
          }
        });
      } else {
        this.router.navigate(['/cart/payment'], { state: { clientId, cartList: this.cartList, totalPrice: this.totalPrice, pending: false } });
      }
    }
  }
}
