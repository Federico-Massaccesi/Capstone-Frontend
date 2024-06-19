import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../Models/i-product';
import { SearchService } from '../../search.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  prodUrl:string = environment.productsUrl

  product: IProduct | undefined;

  constructor(
  private route: ActivatedRoute,
    private prodSvc: SearchService<IProduct>
){}

ngOnInit(): void {
  const productId = this.route.snapshot.paramMap.get('id');

  if (productId) {
    const idNumber = Number(productId);
    this.prodSvc.getOneEntity(this.prodUrl,idNumber).subscribe((product: IProduct) => {
      this.product = product;
      console.log(product);

    });
  }
}
}
