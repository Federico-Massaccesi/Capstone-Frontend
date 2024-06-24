import { CartService } from './../../pages/cart/cart.service';
import { Component, Input } from '@angular/core';
import { IProduct } from '../../Models/i-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  constructor(private cartSvc: CartService){
    this.productInCart = cartSvc.isProductInCart(this.product.id!)
  }

  @Input() product!:IProduct

  @Input() isUser:boolean|undefined;

  productInCart!:boolean

  ngOnInit(): void {
    if (!this.product) {
      console.error('Product is not defined');
    } else {
      console.log('Product loaded:', this.product);
    }
  }

  // addToCart(product:IProduct){
  //   this.cartSvc.addProductToCart(product)
  //   console.log(this.cartSvc.cart);

  // }
}
