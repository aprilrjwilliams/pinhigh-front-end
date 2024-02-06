import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterOutlet, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth-service';
import { BookingsComponent } from '../bookings/bookings.component';
import { AuthInterceptor } from '../../service/auth-interceptor';


@Component({
  selector: 'app-book',
  standalone: true,
  imports: [RouterModule, CommonModule, BookingsComponent],
  providers:[],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription | undefined;
  userAuthenticated = true;

  constructor(private authService: AuthService){}

  ngOnDestroy(): void {
    this.authenticationSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
      console.log('this.userAuthenticated ', this.userAuthenticated)
    })
  }

}
