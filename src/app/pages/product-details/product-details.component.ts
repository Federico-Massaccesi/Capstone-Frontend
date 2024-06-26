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
import { CartService } from '../cart/cart.service';
import { IProductRequest } from '../../Models/iproduct-request';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  quantity:number = 1;

  imageUrl!: SafeUrl;


  constructor(
  private route: ActivatedRoute,
  private router: Router,
    private prodSvc: CRUDService<IProduct>,
    private authSvc : AuthService,
    private http:HttpClient,
    private cartSvc: CartService,
    private sanitizer: DomSanitizer
){
  if (this.authSvc.getUserRole()?.some(role => role.roleType === 'private' || role.roleType === 'company')) {

    this.isUser = true
    } else {
      this.isUser = false
  }

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

  updateProduct(modal: NgbActiveModal): void {
    if (this.product) {

      const selectedCategories = this.selectedCategoryIds.map(id => {
        return this.allCategories.find(category => category.id === id)!});

      const updatedProduct:IProduct = {
        ...this.product,
        name: this.editedProduct.name!,
        price: this.editedProduct.price!,
        description: this.editedProduct.description!,
        imageUrl: this.editedProduct.imageUrl!,
        available: this.editedProduct.available!,
        categories: selectedCategories
      };


      this.prodSvc.updateEntity(this.prodUrl, this.pageProductID, updatedProduct, this.selectedFile).subscribe({
        next: (response) => {
          this.product = updatedProduct
          modal.close(); // Chiude la modale dopo il successo della richiesta
        },
        error: (error) => {
          console.error('Error updating product', error);
        }
      });
    }
  }



  onSubmit(form: NgForm) {
    if (form.invalid) {
        return;
      }
      }

      fetchCategories() {
        this.http.get<ICategory[]>(this.categoryUrl).subscribe(
          (categories) => {
            this.allCategories = categories;
          }
        );
      }

      onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.selectedFile = file;
      }

      addToCart(product: IProduct): void {
        if (!this.cartSvc.isProductInCart(product.id!)) {
          this.cartSvc.addProductToCart(product, this.quantity);
          console.log('Product added to cart:', product);
        } else {
          console.log('Product is already in the cart:', product);
        }
      }

      onImageError() {
        console.error('L\'immagine non può essere caricata.');
      }
    }
