import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProduct, IProductRequest } from './Models/i-product';
import { IOrder } from './Models/i-order';

@Injectable({
  providedIn: 'root'
})
export class CRUDService<T> {

  private items:T[] = [];

  private itemsSubject = new BehaviorSubject<T[]>([]);

  public items$ = this.itemsSubject.asObservable();

  public searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();
  constructor (private http: HttpClient) {

  }

  //---------- CODICE PER BARRA DI RICERCA
  // changeSearchQuery(query: string) {
  //   this.searchQuery.next(query);
  // }

  // searchEntities(url:string,query = ''): Observable<T[]> {
  //   return this.http.get<T[]>(`${url}?q=${query}`);
  // }

  getAllEntities(url: string): Observable<T[]> {
    return this.http.get<T[]>(url).pipe(
      tap((items) => {
        this.items = items;
        this.itemsSubject.next(this.items);
      })
    );
  }


  getOneEntity(url:string,id:number): Observable<T> {

    return this.http.get<T>(`${url}/${id}`);

  }

  deleteEntity(url:string,id: number): Observable<void> {
    return this.http.delete<void>(`${url}/${id}`).pipe(
      tap(() => {
        this.items = this.items.filter(item => (item as any).id !== id);
        this.itemsSubject.next(this.items);
      })
    );
  }

  createEntity(url:string,body: Partial<T>): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      tap((newItem) => {
        this.items.push(newItem);
        this.itemsSubject.next(this.items);
      })
    );
  }

   createEntityWithImage(url:string,entity: Partial<IProductRequest>, file: File): Observable<T> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(entity)], { type: 'application/json' }));
    formData.append('file', file);

    return this.http.post<T>(url, formData).pipe(
      tap((newItem) => {
        this.items.push(newItem);
        this.itemsSubject.next(this.items);
      })
    );
  }

  updateEntity(apiUrl: string, id: number, entity: Partial<IProductRequest>, file?: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('product', new Blob([JSON.stringify(entity)], {
      type: 'application/json'
    }));

    if (file) {
      formData.append('file', file, file.name),{
        type: 'multipart/form-data'
      }
    }

    return this.http.put(`${apiUrl}/${id}`, formData)
    ;
  }
}
