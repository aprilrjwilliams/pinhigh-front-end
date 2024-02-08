import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BookComponent } from './pages/book/book.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { FaqComponent } from './pages/faq/faq.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { ReservationComponent } from './pages/reservation/reservation.component'
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { AdminReservationsComponent } from './pages/admin-reservations/admin-reservations.component'
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import { AuthGuard } from './service/route-guard';
import { ResetComponent } from './pages/reset/reset.component'
import { MembersComponent } from './pages/members/members.component'

export const routes: Routes = [
    {
      path: "",
      component: HomeComponent
    },
    {
      path: 'about',
      component: AboutComponent
    }, 
    {
      path: 'book',
      component: BookComponent
    },
    {
      path: 'contact',
      component: ContactComponent
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'membership',
      component: MembershipComponent
    },
    {
      path: 'registration',
      component: RegistrationComponent
    },
    {
      path: 'faq',
      component: FaqComponent
    },
    {
      path: 'bookings',
      component: BookingsComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'reservation',
      component: ReservationComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'payment',
      component: PaymentPageComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'success',
      component: SuccessPageComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'admin-res',
      component: AdminReservationsComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent,
    },
    {
      path: 'reset/:token',
      component: ResetComponent
    },
    {
      path: 'members',
      component: MembersComponent
    },
    { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
