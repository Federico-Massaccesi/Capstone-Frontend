import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CRUDService } from '../../CRUD.service';
import { IProduct, IProductRequest } from '../../Models/i-product';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ICategory } from '../../Models/i-category';


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
     private http:HttpClient
    ) {}

    ngOnInit() {
      this.searchService.getAllEntities(this.productUrl).subscribe(products => {
        this.products = products;
      });

      this.searchService.items$.subscribe((r) => {
        this.products = r;
      });

      this.fetchCategories();
    }




    //RIGHE PER BARRA DI RICERCA
    // this.searchService.currentSearchQuery.subscribe(query => {
    //   this.http.get<IProduct[]>(`${this.productUrl}?q=${query}`).subscribe(data => {
    //     this.results = [...data];
    //   });
    // });




  private modalService = inject(NgbModal);

	open(content: TemplateRef<any>) {
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
