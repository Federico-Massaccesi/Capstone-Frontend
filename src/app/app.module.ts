import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main-component/header/header.component';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './main-component/landing/landing.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ContactsComponent } from './main-component/contacts/contacts.component';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth/auth.service';
import { OrderCardComponent } from './main-component/order-card/order-card.component';
import { NgbCollapseModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NotAuthorizedComponent } from './main-component/not-authorized/not-authorized.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    ContactsComponent,
    OrderCardComponent,
    NotAuthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgbCollapseModule,
    NgbTooltipModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
