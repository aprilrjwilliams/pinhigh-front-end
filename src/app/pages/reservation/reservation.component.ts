import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Timeslot } from '../bookings/bookings.model';
import { TimeslotDataService } from "../../service/timeslot-data.component";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service"
import { AuthService } from '../../service/auth-service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule],
  providers: [ConfirmationDialogService],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit, OnDestroy {

  constructor(
    private timeslotDataService: TimeslotDataService,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  timeslotsSub = new Subscription();

  public timeslots: Timeslot[] = [];
  public user_id = '';

  ngOnDestroy(): void {
    this.timeslotsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.user_id = this.authService.getUserId();
    console.log("user_id - ", this.user_id);
    this.getUserTimeslots();
  }

  getUserTimeslots(): void {
    this.timeslotDataService.getTimeslotsbyUser(this.user_id);
      this.timeslotsSub = this.timeslotDataService.timeslotSubject.subscribe(
        (timeslots) => {
          this.timeslots = timeslots;
          console.log("timeslots ", this.timeslots);
          this.sortByDate();
        }
      );
  }

  sortByDate(): void {
    this.timeslots.sort((a,b)=> (new Date(a.date + ' ' + a.startTime).getTime()) - (new Date(b.date + ' ' + b.startTime).getTime()))
  }

  deleteTimeslot(timeslot: Timeslot): void {
    if(timeslot.id){
      this.timeslotDataService.onDeleteTimeslot(timeslot.id);
    }
  }

  public openDeleteConfirmationDialog(timeslot: Timeslot) {
    const message = timeslot.date + ' at ' + timeslot.startTime + ' on bay ' + timeslot.bay;
    console.log(' openConfirmationDialog ', message)
    this.confirmationDialogService.delete('Delete Booking', message)
    .then((confirmed) => {
      if(confirmed){  
        this.deleteTimeslot(timeslot);
        this.getUserTimeslots();
      }
    })
    .catch(() => console.log('User cancelled'));
  }
}
