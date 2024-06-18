import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginDTO } from '../Models/login-dto';
import { iUser } from '../Models/iUser';
import { HttpClient } from '@angular/common/http';

type AccessData = {
  accessToken:string,
  user:iUser
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService = new JwtHelperService();
  authSubject = new BehaviorSubject<iUser | null>(null);
  user$ = this.authSubject.asObservable()
  isLoggedIn$ = this.user$.pipe(map(user => Boolean(user)))

  syncIsLoggedIn: boolean = false;

  constructor(private http: HttpClient,
    private router: Router
  ) {

   }

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  register(newUser: Partial<iUser>): Observable<AccessData>{

    return this.http.post<AccessData>(this.registerUrl,newUser)
  }

  login(loginData:LoginDTO): Observable<AccessData>{

    return this.http.post<AccessData>(this.loginUrl,loginData).pipe(
      tap((data) =>{
        this.authSubject.next(data.user);
        localStorage.setItem('accessData',JSON.stringify(data))

      this.autoLogout(data.accessToken)
      })
    )
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/']);
  }

  getAccessToken(): string {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return '';

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return '';

    return accessData.accessToken;
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();


    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return;

    this.authSubject.next(accessData.user);
    this.autoLogout(accessData.accessToken);
  }
}
