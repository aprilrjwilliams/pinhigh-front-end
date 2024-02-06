import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { Timeslot } from './bookings.model'
import { Timeslot } from "../../models/timeslot.model";
import { TimeslotDataService } from "../../service/timeslot-data.component";
import { Subscription } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../service/auth-service";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service"

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormField,
    MatInputModule
  ],
  providers: [MatDatepickerModule, ConfirmationDialogService],
  templateUrl: "./bookings.component.html",
  styleUrl: "./bookings.component.css",
})
export class BookingsComponent implements OnInit, OnDestroy {
  constructor(
    private timeslotDataService: TimeslotDataService,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  public pickedDate: any = null;
  public user_id = "";

  public mock_ts: Timeslot[] = [
    {
      id: "1",
      user_id: "",
      date: "1/1/2024",
      startTime: "9:00 AM",
      bay: "",
    },
    {
      id: "2",
      user_id: "",
      date: "1/1/2024",
      startTime: "12:00 PM",
      bay: "",
    },
    {
      id: "3",
      user_id: "",
      date: "1/1/2024",
      startTime: "4:00 PM",
      bay: "",
    },
  ];

  public selectedDateTimeslots: Timeslot[] = [];
  public bookedTimeslots: Timeslot[] = [];
  public availableTimeslots: Timeslot[] = [];
  public selectedDate: string = "";
  public isLoading = true;
  public showBaySelect = false;
  public selectedBay = "";

  timeslotsSub = new Subscription();

  ngOnDestroy(): void {
    this.timeslotsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.user_id = this.authService.getUserId();
    console.log("user_id - ", this.user_id);
  }

  OnDateChange(date: any) {
    this.isLoading = true;
    console.log("date change ", date);

    this.selectedDate = this.getDateString(date);
    console.log("selectedDate ", this.selectedDate);

    //TODO clear bay number when date changes
    //TODO disable past dates

    this.showBaySelect = true;
  }

  onBayChange(bay: string): void {
    console.log("onBayChange ", bay);

    if (bay != "") {
      this.selectedBay = bay;

      // this.selectedDateTimeslots = this.generateTimeslots(this.selectedDate);
      this.selectedDateTimeslots = this.getTimeDDL(30, bay)
      console.log("selectedDateTimeslots ", this.selectedDateTimeslots);

      this.timeslotDataService.getTimeslots(this.selectedDate, this.selectedBay);
      this.timeslotsSub = this.timeslotDataService.timeslotSubject.subscribe(
        (timeslots) => {
          this.bookedTimeslots = timeslots;
          console.log("bookedTimeslots ", this.bookedTimeslots);
          this.getAvailableTimeslots();
          console.log("availableTimeslots ", this.availableTimeslots);
          this.isLoading = false;
        }
      );
    }
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

  // getUniqueId(): string {
  //   const dateString = Date.now().toString(36);
  //   const randomness = Math.random().toString(36).substr(2);
  //   return dateString + randomness;
  // }

  getTimeDDL(intervalMinutes: number, bay: string) {
    let formatHour = (hour: number, minutes: number) => {
      let minutesPadded = minutes.toString().padStart(2, "0");
      return {
        id: "",
        user_id: "",
        date: this.selectedDate,
        bay: bay,
        startTime:
          hour < 12 || hour == 24
            ? (hour < 24 ? hour : 12) + `:${minutesPadded} AM`
            : (hour - 12 || 12) + `:${minutesPadded} PM`,
      };
    };

    let timesDDL = [];
    let hour = 7;
    while (hour <= 24) {
      timesDDL.push(formatHour(hour, 0));

      if (hour < 24) {
        let steps = 60 / intervalMinutes;
        let i = 1;
        while (i < steps) {
          let minutes = intervalMinutes * i;
          timesDDL.push(formatHour(hour, minutes));
          i++;
        }
      }

      hour++;
    }

    return timesDDL;
  }

  generateTimeslots(selectedDate: string): Timeslot[] {
    let timeslots: Timeslot[] = [];

    for (let i = 7; i <= 24; i++) {
      let startTime = ""; //format: HH:MM AM/PM

      if (i < 12) {
        startTime = i + ":00 AM";
      } else if (i == 12) {
        startTime = i + ":00 PM";
      } else {
        let hour = i % 12;
        startTime = hour + ":00 PM";
      }

      timeslots.push({
        id: "",
        user_id: "",
        date: selectedDate,
        startTime: startTime,
        bay: "",
      });
    }

    return timeslots;
  }

  getAvailableTimeslots(): void {
    this.availableTimeslots = this.selectedDateTimeslots.filter((val) => {
      return !this.bookedTimeslots.find((val2) => {
        return val.startTime === val2.startTime;
      });
    });
  }

  addTimeslot(timeslot: Timeslot): void {
    this.timeslotDataService.onAddTimeslot(timeslot);
  }

  removeTimeSlotFromList(startTime: string): void {
    console.log('available TS before ', this.availableTimeslots)
    let index = this.availableTimeslots.findIndex(t => t.startTime === startTime); //find index in your array
    this.availableTimeslots.splice(index, 1);//remove element from array
    console.log('available TS after ', this.availableTimeslots)
  }


  public openConfirmationDialog(timeslot: Timeslot) {
    const message = timeslot.date + ' at ' + timeslot.startTime + ' on bay ' + this.selectedBay;
    console.log(' openConfirmationDialog ', message)
    this.confirmationDialogService.confirm('Confirm Booking', message)
    .then((confirmed) => {
      if(confirmed){  
        timeslot.user_id = this.user_id;
        timeslot.bay = this.selectedBay;
        this.removeTimeSlotFromList(timeslot.startTime);
        console.log("adding timeslot ", timeslot);
        this.addTimeslot(timeslot);
      }
    })
    .catch(() => console.log('User cancelled'));
  }
}
