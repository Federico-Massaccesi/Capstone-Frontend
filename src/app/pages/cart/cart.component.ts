import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { iCartItem } from '../../Models/cart-item';
import { Subscription } from 'rxjs';
import { IOrder } from '../../Models/i-order';
import { AuthService } from '../../auth/auth.service';
import { IOrderRequest } from '../../Models/i-order-request';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartList!: iCartItem[];
  totalPrice: number = 0;
  private cartSubscription!: Subscription;

  constructor(private cartSvc: CartService,private authSvc: AuthService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartSvc.cart$.subscribe(cart => {
      this.cartList = cart;
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
      console.error('User ID not found');
      return;
    }

    const order: IOrderRequest = {
      client: clientId,
      items: this.cartList,
      localDate: new Date(),
      pending: true,
      totalPrice: this.totalPrice,
      checked: false
    };

    this.cartSvc.createOrder(order).subscribe(
      response => {
        console.log('Order created successfully', response);
        this.cartSvc.cleanCart();
      },
      error => {
        console.error('Error creating order', error);
      }
    );
  }
}
