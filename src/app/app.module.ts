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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotAuthorizedComponent } from './main-component/not-authorized/not-authorized.component';
import { PaymentComponent } from './pages/cart/payment/payment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    ContactsComponent,
    OrderCardComponent,
    NotAuthorizedComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    FormsModule
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
