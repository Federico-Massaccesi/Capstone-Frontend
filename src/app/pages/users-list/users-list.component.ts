import { Component } from '@angular/core';
import { iUser } from '../../Models/iUser';
import { CRUDService } from '../../CRUD.service';
import { environment } from '../../../environments/environment';
import { SearchbarService } from '../../searchbar.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  userList!: iUser[];
  results!: iUser[];
  searchQuery: string = '';
  userUrl: string = environment.usersUrl;

  constructor(
    private userSvc: CRUDService,
    private searchSvc: SearchbarService,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.userSvc.getAllEntities(this.userUrl, 'user').subscribe((users: iUser[]) => {
      this.userList = users;
      this.results = users; // Mostra tutti gli utenti all'inizio
    });

    this.userSvc.userItems$.subscribe((users: iUser[]) => {
      this.userList = users;
      if (!this.searchQuery) {
        this.results = users; // Mostra tutti gli utenti all'inizio
      }
    });

    this.searchSvc.$currentSearchQuery.subscribe(query => {
      this.searchQuery = query;
      if (query) {
        this.searchSvc.searchUsers(query).subscribe(data => {
          this.results = data.length > 0 ? [...data] : [];
        });
      } else {
        this.results = this.userList; // Resetta i risultati di ricerca quando la barra di ricerca è vuota
      }
    });
  }

  updateSearchQuery(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target?.value ?? '';
    this.searchSvc.changeSearchQuery(query);
  }

  hasRole(roles: any[], roleType: string): boolean {
    const userRoles = this.authSvc.getUserRole();
    return userRoles ? userRoles.some(role => role.roleType === roleType) : false;
  }

}
