import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUDService } from '../../CRUD.service';
import { IProduct } from '../../Models/i-product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

 productUrl:string = environment.productsUrl

  products!: Observable<IProduct[]>;
  results: IProduct[] = [];
  constructor(private http: HttpClient, public searchService: CRUDService<IProduct>) {}

  ngOnInit() {
    this.products = this.searchService.getAllEntities(this.productUrl)



    //RIGHE PER BARRA DI RICERCA
    // this.searchService.currentSearchQuery.subscribe(query => {
    //   this.http.get<IProduct[]>(`${this.productUrl}?q=${query}`).subscribe(data => {
    //     this.results = [...data];
    //   });
    // });
  }

}
