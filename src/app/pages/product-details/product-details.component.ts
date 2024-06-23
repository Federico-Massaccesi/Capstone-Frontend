import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../Models/i-product';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  prodUrl:string = environment.productsUrl

  product: IProduct | undefined;

  isUser!:boolean;

  productAvailable!:boolean


  pageProductID!:number
  constructor(
  private route: ActivatedRoute,
  private router: Router,
    private prodSvc: CRUDService<IProduct>,
    private authSvc : AuthService,
    private http:HttpClient
){
  this.isUser = authSvc.getUserRole();


}

ngOnInit(): void {
  const productId = this.route.snapshot.paramMap.get('id');

  if (productId) {
    const idNumber = Number(productId);
    this.pageProductID = idNumber
    this.prodSvc.getOneEntity(this.prodUrl,idNumber).subscribe((product: IProduct) => {
      this.product = product;
      console.log(product);

        this.productAvailable = this.product?.available
    });
  }

}

deleteProduct():void{
  this.prodSvc.deleteEntity(this.prodUrl,this.pageProductID).subscribe(()=>{
    this.router.navigate(['/productList']);
  })
}

toggleAvailability(checked: boolean): void {
  if (this.product) {
    const url = `${this.prodUrl}/${this.product.id}/availability`;
    this.http.patch<IProduct>(url, { available: checked }).subscribe({
      next: (updatedProduct) => {
        if (updatedProduct) {
          this.productAvailable = updatedProduct.available;
        }
        this.router.navigate(['/productList']);

      },
      error: (error) => {
        console.error('Error updating product availability:', error);
      }
    });
  }
}
}
