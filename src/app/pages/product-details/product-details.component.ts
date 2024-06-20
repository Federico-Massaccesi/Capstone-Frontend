import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../Models/i-product';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  prodUrl:string = environment.productsUrl

  product: IProduct | undefined;

  pageProductID!:number
  constructor(
  private route: ActivatedRoute,
    private prodSvc: CRUDService<IProduct>
){}

ngOnInit(): void {
  const productId = this.route.snapshot.paramMap.get('id');

  if (productId) {
    const idNumber = Number(productId);
    this.pageProductID = idNumber
    this.prodSvc.getOneEntity(this.prodUrl,idNumber).subscribe((product: IProduct) => {
      this.product = product;
    });
  }
}

deleteProduct(){
  this.prodSvc.deleteEntity(this.prodUrl,this.pageProductID)
}
}
