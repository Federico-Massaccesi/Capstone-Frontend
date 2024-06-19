import { Component, Input } from '@angular/core';
import { IProduct } from '../../Models/i-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input() product!:IProduct

}
