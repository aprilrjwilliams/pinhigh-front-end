import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app.routes';
import { AppComponent }  from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BookComponent } from './pages/book/book.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';

import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './service/auth-interceptor';




@NgModule({
  providers: [
    provideHttpClient(
      withFetch(),
    ),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  declarations: [  
  ],
  bootstrap: [  
  ]
})
export class AppModule { }