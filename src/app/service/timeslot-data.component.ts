import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";
import { Timeslot } from "../models/timeslot.model";
import { environment } from "../../environments/environment";

@Injectable({providedIn:"root"})
export class TimeslotDataService{

    public maxId: number = 0;

    constructor(private http: HttpClient){}

    
    //TODO remove - not using
    // updateTimeslot(id: string, timeslot: Timeslot) {
    //   this.http.put<{message: string}>('http://localhost:3000/update-timeslot/' + id, timeslot).subscribe((jsonData) => {
    //     console.log(jsonData.message);
    //     // this.getTimeslots();
    //   })
    // }
    
    public timeslotSubject = new Subject<Timeslot[]>();
    private timeslots: Timeslot[] = [];
    private userTimeslots: Timeslot[] = [];

    onDeleteTimeslot(id: string){
        
        this.http.delete<{message: string}>(environment.apiUrl + '/remove-timeslot/' + id).subscribe((jsonData) => {
        console.log(jsonData.message);
        // this.getTimeslots();
        })
    }

    getTimeslots(date: string, bay?: string){
        let params = {}
        if(bay){
            params = {date: date, bay: bay}
        } else {
            params = {date: date}
        }

        console.log('params ', params)

        this.http.get<{timeslots: any}>(environment.apiUrl + '/timeslots', {params: params})
        .pipe(map((responseData) => {
            console.log('responseData ', responseData)
            return responseData.timeslots.map((timeslot: {date: string; startTime: string; _id: string, user_id: string, bay: string}) => {
                return {
                    date: timeslot.date,
                    startTime: timeslot.startTime,
                    id: timeslot._id,
                    user_id: timeslot.user_id,
                    bay: timeslot.bay
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.timeslots = updateResponse;
            this.timeslotSubject.next(this.timeslots);
        })
    }

    getTimeslotsbyUser(user_id: string){
        this.http.get<{timeslots: any}>(environment.apiUrl + '/timeslots', {params: {user_id: user_id}})
        .pipe(map((responseData) => {
            console.log('responseData ', responseData)
            return responseData.timeslots.map((timeslot: {date: string; startTime: string; _id: string, user_id: string, bay: string}) => {
                return {
                    date: timeslot.date,
                    startTime: timeslot.startTime,
                    id: timeslot._id,
                    user_id: timeslot.user_id,
                    bay: timeslot.bay
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.userTimeslots = updateResponse;
            this.timeslotSubject.next(this.userTimeslots);
        })
    }

    getTimeslot(date: string){
        const index = this.timeslots.findIndex(el => {
            return el.date == date;
        })
        return this.timeslots[index];
    }

    onAddTimeslot(timeslot: Timeslot){
        console.log('in shared - onAddTimeslot ', timeslot)
        this.http.post<{message: string}>(environment.apiUrl + '/add-timeslot', timeslot).subscribe((jsonData) => {
            console.log(timeslot);
            // this.getTimeslots();
        })
    }


    // getUserById(id: string){
    //     console.log('in getUserById ', id)
    //     this.http.get<{users: any}>('http://localhost:3000/usermodels', {params: {_id: id}})
    //     .pipe(map((responseData) => {
    //         console.log('responseData ', responseData)
    //         return responseData.users.map((user: {email: string, password: string, firstname: string, lastname: string, phone: string, isAdmin: string}) => {
    //             return {
    //                 email: user.email,
    //                 password: user.password,
    //                 firstname: user.firstname,
    //                 lastname: user.lastname,
    //                 phone: user.phone,
    //                 isAdmin: user.isAdmin,
    //             }
    //         })
    //     }))
    //     .subscribe((updateResponse) => {
    //         this.userTimeslots = updateResponse;
    //         this.timeslotSubject.next(this.userTimeslots);
    //     })
    // }

    getUserById(id: string): Observable<any>{
        console.log('in getUserById ', id)
        return this.http.get<{users: any}>(environment.apiUrl + '/usermodels', {params: {_id: id}})
    }




    
}