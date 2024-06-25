import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, inject } from '@angular/core';
import { CRUDService } from '../../CRUD.service';
import { IProduct } from '../../Models/i-product';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ICategory } from '../../Models/i-category';
import { AuthService } from '../../auth/auth.service';
import { IProductRequest } from '../../Models/iproduct-request';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  newProduct:Partial<IProductRequest> = {

    available:false,
    categories:[]
  }

  isUser:boolean = true;

  categoriesUrl :string = environment.categoriesUrl;

  selectedCategoryIds: number[] = [];
  allCategories: ICategory[] = [];

 productUrl:string = environment.productsUrl

 availableCreate:boolean = false

 private selectedFile: File | undefined;

 products: IProduct[] = [];
 results: IProduct[] = [];

  constructor(
     public searchService: CRUDService<IProduct>,
     private http:HttpClient,
     private authSvc: AuthService
    ) {}

    ngOnInit() {

      if (this.authSvc.getUserRole()?.some(role => role.roleType === 'PRIVATE' || role.roleType === 'COMPANY')) {
        this.isUser = true
      } else {
        this.isUser = false
      }

      this.searchService.getAllEntities(this.productUrl).subscribe(products => {
        this.products = products;
      });

      this.searchService.items$.subscribe((r) => {
        this.products = r;
      });

    }




    //RIGHE PER BARRA DI RICERCA
    // this.searchService.currentSearchQuery.subscribe(query => {
    //   this.http.get<IProduct[]>(`${this.productUrl}?q=${query}`).subscribe(data => {
    //     this.results = [...data];
    //   });
    // });




  private modalService = inject(NgbModal);

	open(content: TemplateRef<any>) {
    this.fetchCategories();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => {
        this.createProduct();
      }
    );
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }
onSubmit(form: NgForm) {
  if (form.invalid) {
      return;
    }
    }

  createProduct() {
    this.newProduct.categories = this.selectedCategoryIds;
    this.newProduct.available = this.availableCreate;

    if(this.selectedFile !== undefined && this.newProduct.name !== undefined) {
    this.searchService.createEntityWithImage(this.productUrl,this.newProduct, this.selectedFile ).subscribe();
    }

  }

  fetchCategories() {
    this.http.get<ICategory[]>(this.categoriesUrl).subscribe(
      (categories) => {
        this.allCategories = categories;
        console.log('Categories loaded:', this.allCategories); // Log per debug
      }
    );
  }

}
