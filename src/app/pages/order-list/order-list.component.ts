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

  orders!: IOrder[];
  results: IOrder[] = [];
  constructor(private http: HttpClient, public searchService: CRUDService) {}

  ngOnInit(): void {
    this.searchService.getAllEntities(this.ordersUrl, 'order').subscribe((orders: IOrder[]) => {
      this.orders = orders;
    });

    this.searchService.orderItems$.subscribe((orders: IOrder[]) => {
      this.orders = orders;
    });
  }


    //RIGHE PER BARRA DI RICERCA
    // this.searchService.currentSearchQuery.subscribe(query => {
    //   this.http.get<IProduct[]>(`${this.productUrl}?q=${query}`).subscribe(data => {
    //     this.results = [...data];
    //   });
    // });

}
