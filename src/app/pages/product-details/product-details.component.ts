import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../Models/i-product';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ICategory } from '../../Models/i-category';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  editedProduct: Partial<IProduct> = {};

  prodUrl:string = environment.productsUrl

  categoryUrl:string = environment.categoriesUrl

  product: IProduct | undefined;

  isUser!:boolean;

  productAvailable!:boolean

  allCategories!:ICategory[]

  selectedCategoryIds: number[] = [];

  pageProductID!:number

  private selectedFile: File | undefined;


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
    this.pageProductID = idNumber;
    this.prodSvc.getOneEntity(this.prodUrl, idNumber).subscribe((product: IProduct) => {
      this.product = product;
      this.productAvailable = this.product?.available || false;
      this.editedProduct = { ...this.product };
      if(product !=undefined && product.categories !=undefined)
        this.selectedCategoryIds = this.product?.categories
      ? this.product.categories.map(category => category.id).filter((id): id is number => id !== undefined)
      : [];
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

private modalService = inject(NgbModal);

	open(content: TemplateRef<any>) {
    this.fetchCategories()

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => {
      }
    );
  }

  // DA VEDERE CON MAURO
  // onSaveClick(modal: NgbActiveModal): void {

  //   const formData = new FormData();
  //   formData.append('product', new Blob([JSON.stringify(this.editedProduct)], { type: 'application/json' }));

  //   if (this.selectedFile) {

  //     formData.append('file', this.selectedFile);
  //   }

  //   this.prodSvc.updateEntity(this.prodUrl, this.pageProductID , formData).subscribe({
  //     next: (updatedProduct) => {
  //       this.product = updatedProduct;
  //       modal.close('Save click');
  //     }
  //   });
  // }

  onSubmit(form: NgForm) {
    if (form.invalid) {
        return;
      }
      }

      fetchCategories() {
        this.http.get<ICategory[]>(this.categoryUrl).subscribe(
          (categories) => {
            this.allCategories = categories;
            console.log(categories);

          }
        );
      }

      onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.selectedFile = file;
      }
}
