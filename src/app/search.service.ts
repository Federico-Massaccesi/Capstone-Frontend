import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService<T> {

  public searchQuery = new BehaviorSubject<string>(''); // permette l'aggiornamento della query di ricerca
  currentSearchQuery = this.searchQuery.asObservable(); // permette di osservare la query di ricerca corrente
  constructor (private http: HttpClient) {}

  changeSearchQuery(query: string) { // questo metodo non sostituisce searchWines, ma permette di aggiornare la query di ricerca rendendo possibile la ricerca in tempo reale
    this.searchQuery.next(query);     // con aggiornamento dinamico della card del risultato.
  }

  searchEntities(url:string,query = ''): Observable<T[]> {
    return this.http.get<T[]>(`${url}?q=${query}`);
  }

  getAllEntities(url:string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  getOneEntity(url:string,id:number): Observable<T> {

    return this.http.get<T>(`${url}/${id}`);

  }
}
