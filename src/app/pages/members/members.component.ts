import { Component, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { UserService } from '../../service/user-service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { UserModel } from '../../models/user-model';
import { FormControl } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbHighlight
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit, OnDestroy{

  // id: string;
  //   email: string;
  //   password: string;
  //   firstname?: string;
  //   lastname?: string;
  //   phone?: string;
  //   isAdmin?: string

  usersSub = new Subscription();
  public users: UserModel[] = [];
  public users$: Observable<UserModel[]> = new Observable;
	filter = new FormControl('', { nonNullable: true });

  constructor(private userService: UserService) {
    // this.users$ = this.filter.valueChanges.pipe(
		// 	startWith(''),
		// 	map((text) => this.search(text)),
		// );
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    console.log('here')
    this.userService.getUsers();
    this.usersSub = this.userService.userSubject.subscribe(
      (users) => {
        this.users = users;
        console.log("users ", this.users);
        this.users$ = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text)),
        );

      }
    );
  }

  // https://ng-bootstrap.github.io/#/components/table/examples

  search(text: string): UserModel[] {
    return this.users.filter((user) => {
      const term = text.toLowerCase();
      return (
        user.firstname?.toLowerCase().includes(term) ||
        user.lastname?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    })
  }

}
