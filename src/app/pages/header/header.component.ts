import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterOutlet, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription | undefined;
  private adminSub: Subscription | undefined;
  public userAuthenticated = true;
  public adminUser = true;
  public user: any;
  

  constructor(private authService: AuthService) { }

  ngOnDestroy(): void {
    this.authenticationSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })

    console.log('userAuthenticated ', this.userAuthenticated)

    this.adminUser = this.authService.getIsAdmin();
    this.adminSub = this.authService.getAdminSub().subscribe(status => {
      this.adminUser = status;
    })
    console.log('adminUser ', this.adminUser)

  }

  logout(){
    this.authService.logout();
  }

  //TODO fix admin 

}
