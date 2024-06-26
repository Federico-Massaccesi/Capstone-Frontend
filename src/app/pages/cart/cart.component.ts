import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { iCartItem } from '../../Models/cart-item';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { IOrderRequest } from '../../Models/i-order-request';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartList: iCartItem[] = []
  totalPrice: number = 0;
  private cartSubscription!: Subscription;

  constructor(private cartSvc: CartService,private authSvc: AuthService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartSvc.cart$.subscribe(cart => {
      this.cartList = cart;
      console.log(this.cartList);

      this.updateTotalPrice();
      console.log('Cart updated:', this.cartList);
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

  const order: IOrderRequest = {
    clientId: clientId,
    products: this.cartList,
    totalPrice: this.totalPrice
  };

  this.cartSvc.createOrder(order).subscribe({
    next: (response) => {
      this.cartSvc.cleanCart();
    }
  });
}
}
