import { CRUDService } from './../../CRUD.service';
import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { iCartItem } from '../../Models/cart-item';
import { Subscription, pipe, tap } from 'rxjs';
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
  private productSubscription!: Subscription;
  private userRoles: iRole[] | undefined;
  isCompanyUser: boolean = false;
  payLater: boolean = false;
  missingProductIds: (number|undefined)[] = [];


  constructor(private cartSvc: CartService
    ,private authSvc: AuthService,
  private router:Router,
private crudSvc: CRUDService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartSvc.cart$.subscribe(cart => {
      this.cartList = cart;
      this.updateTotalPrice();

      this.userRoles = this.authSvc.getUserRole();
    this.isCompanyUser = this.userRoles?.some(role => role.roleType === 'COMPANY') || false;
    this.checkMissingProducts();
    });

    this.productSubscription = this.crudSvc.productItems$.subscribe(() => {
      this.checkMissingProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  checkMissingProducts(): void {
    this.crudSvc.productItems$.subscribe(productItems => {
      const productIds = productItems.map(product => product.id).filter((id): id is number => id !== undefined);
      this.missingProductIds = this.cartList
        .map(item => item.product.id)
        .filter(id => id !== undefined && !productIds.includes(id));
    });
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
          pending: true
        };

        this.cartSvc.createOrder(order).subscribe({
          next: (response) => {
            this.cartSvc.cleanCart();
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.router.navigate(['/cart/payment'], { state: { clientId, cartList: this.cartList, totalPrice: this.totalPrice, pending: false } });
      }
    }
  }
}
