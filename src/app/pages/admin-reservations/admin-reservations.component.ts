import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Timeslot } from '../bookings/bookings.model';
import { TimeslotDataService } from "../../service/timeslot-data.component";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service"
import { AuthService } from '../../service/auth-service';
import { UserService } from '../../service/user-service';
import { Subscription } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { UserModel } from "../../models/user-model";

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormField,
    MatInputModule],
  providers: [ConfirmationDialogService, MatDatepickerModule],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.css'
})
export class AdminReservationsComponent implements OnInit, OnDestroy{

  public selectedDateTimeslots: Timeslot[] = [];
  public bookedTimeslots: Timeslot[] = [];
  public selectedDate: string = "";
  public isLoading = true;
  public showBaySelect = false;
  public selectedBay = "";
  public showTable = false;

  constructor(
    private timeslotDataService: TimeslotDataService,
    private authService: AuthService,
    private userService: UserService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  timeslotsSub = new Subscription();
  usersSub = new Subscription();

  public timeslots: Timeslot[] = [];
  public users: UserModel[] = [];
  public fullTimeslots: any[] = [];

  ngOnDestroy(): void {
    this.timeslotsSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getUsers();
  }


  OnDateChange(date: any) {
    this.isLoading = true;
    console.log("date change ", date);

    this.selectedDate = this.getDateString(date);
    console.log("selectedDate ", this.selectedDate);

    //TODO clear bay number when date changes

    this.timeslotDataService.getTimeslots(this.selectedDate);
    this.timeslotsSub = this.timeslotDataService.timeslotSubject.subscribe(
      (timeslots) => {
        this.timeslots = timeslots;
        console.log("timeslots ", this.timeslots);
        this.sortByDate();
        this.getTimeslotUser();
        this.isLoading = false;
        this.showTable = true;
      }
    );
  }

  sortByDate(): void {
    this.timeslots.sort((a,b)=> (new Date(a.date + ' ' + a.startTime).getTime()) - (new Date(b.date + ' ' + b.startTime).getTime()))
  }

  getDateString(date: Date): string {
    let dateString = "";
    if (date) {
      // dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
      dateString =
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    }

    return dateString;
  }

  getTimeslotUser(): void{
    this.fullTimeslots = [];
    for(let ts of this.timeslots) {
      console.log('ts.user_id ', ts.user_id)
      
      let user = this.users.find((user) => user.id == ts.user_id)

      this.fullTimeslots.push({
        timeslot: ts,
        user: user
      })
    }
    console.log('fullTimeslots ', this.fullTimeslots)
  }

  getUsers(){
    console.log('here')
    this.userService.getUsers();
    this.usersSub = this.userService.userSubject.subscribe(
      (users) => {
        this.users = users;
        console.log("users ", this.users);
      }
    );
  }

}
