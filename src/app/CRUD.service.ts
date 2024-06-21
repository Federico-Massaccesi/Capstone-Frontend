import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProduct, IProductRequest } from './Models/i-product';
import { IOrder } from './Models/i-order';

@Injectable({
  providedIn: 'root'
})
export class CRUDService<T> {

  productSbj = new BehaviorSubject<IProduct[]>([]);

  product$ = this.productSbj.asObservable();

  ordersSbj = new BehaviorSubject<IOrder[]>([]);

  orders$ = this.ordersSbj.asObservable();

  public searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();
  constructor (private http: HttpClient) {}

  changeSearchQuery(query: string) {
    this.searchQuery.next(query);
  }

  searchEntities(url:string,query = ''): Observable<T[]> {
    return this.http.get<T[]>(`${url}?q=${query}`);
  }

  getAllEntities(url:string): Observable<T[]> {
    return this.http.get<T[]>(url)
  }



  getOneEntity(url:string,id:number): Observable<T> {

    return this.http.get<T>(`${url}/${id}`);

  }

  deleteEntity(url:string,id:number): Observable<void>{

    return this.http.delete<void>(`${url}/${id}`);
   }

   createEntity(url:string,body:Partial<T>): Observable<T> {

    return this.http.post<T>(url, body)
   }

   createEntityWithImage(url: string, entity: Partial<IProductRequest>, file: File, entityName: string): Observable<T> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(entity)], { type: 'application/json' }));
    formData.append('file', file);

    return this.http.post<T>(url, formData);
  }
}
