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
    });
  }
  if(this.product != undefined)
  this.productAvailable = this.product?.available
}

deleteProduct():void{
  this.prodSvc.deleteEntity(this.prodUrl,this.pageProductID).subscribe(()=>{
    this.router.navigate(['/productList']);
  })
}
//FIXARE L NGIF DELLE ICONE DEL TOGGLE
//DEVO FARE IN MODO CHE IL BOTTONE PER FARE PARTIRE IL METODO PUT VENGA VISUALIZZATO
//SOLO NEL MOMENTO IN CUI LA DISPONIBILITà IMPOSTATA è DIVERSA DA QUELLA DEL PRODOTTO
toggleAvailability(boolean:boolean) {
  if (this.product !== undefined) {
    const url = `${this.prodUrl}/${this.product.id}/availability`;
    this.http.put<IProduct>(url, { available: boolean }).subscribe(
      (updatedProduct) => {
        if (updatedProduct !== undefined) {
          this.productAvailable = updatedProduct.available;
        }
        return;
      }
    );
  }else{
    return;

  }

}
}
