import { CartService } from './../../pages/cart/cart.service';
import { Component, Input } from '@angular/core';
import { IProduct } from '../../Models/i-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  constructor(private cartSvc: CartService){  }

  @Input() product!:IProduct

  @Input() isUser:boolean|undefined;

  productInCart!:boolean

  quantity:number=0;

  showTooltip:boolean=false

  quantityWarnings:boolean=false;

  ngOnInit(): void {
    console.log('Product input in child:', this.product);
    if (!this.product || !this.product.id) {
      console.error('Product or product ID is not defined');
    } else {
      this.productInCart = this.cartSvc.isProductInCart(this.product.id);
      const cartItem = this.cartSvc.getCart().find(item => item.product.id === this.product.id);
      if (cartItem) {
        this.quantity = cartItem.quantity;
      }
      console.log('Product loaded:', this.product);
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: IProduct, quantity: number): void {
    if (quantity > 0) {
      this.cartSvc.addProductToCart(product, quantity);
      console.log('Product added to cart:', product);
      console.log(this.cartSvc.getCart());
    } else {
      this.quantityWarnings = true
      console.error('Invalid quantity:', quantity);
    }
  }

  removeFromCart(product: IProduct): void {
    this.cartSvc.removeProductFromCart(product);
    this.productInCart = false;
    this.quantity = 1;
    console.log('Product removed from cart:', product);
    console.log(this.cartSvc.getCart());
  }
}
