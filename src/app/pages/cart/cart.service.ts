import { Injectable } from '@angular/core';
import { IProduct } from '../../Models/i-product';
import { CartItem } from '../../Models/i-order';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cart: CartItem[] = [];

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addProductToCart(product: IProduct, quantity: number) {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    this.saveCart();
  }

  removeProductFromCart(product: IProduct) {
    this.cart = this.cart.filter(item => item.product.id !== product.id);
    this.saveCart();
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  cleanCart(): void {
    this.cart = [];
    this.saveCart();
  }

  isProductInCart(productId: number): boolean {
    return this.cart.some(item => item.product.id === productId);
  }

}
