import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IOrder } from '../../Models/i-order';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from '../../CRUD.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  ordersUrl:string = environment.productsUrl

  orders!: Observable<IOrder[]>;
  results: IOrder[] = [];
  constructor(private http: HttpClient, public searchService: CRUDService<IOrder>) {}

  ngOnInit() {
    this.orders = this.searchService.getAllEntities(this.ordersUrl)


    //RIGHE PER BARRA DI RICERCA
    // this.searchService.currentSearchQuery.subscribe(query => {
    //   this.http.get<IProduct[]>(`${this.productUrl}?q=${query}`).subscribe(data => {
    //     this.results = [...data];
    //   });
    // });
  }
}
