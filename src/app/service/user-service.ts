import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";
import { UserModel } from "../models/user-model";
import { environment } from "../../environments/environment";

@Injectable({providedIn:"root"})
export class UserService{

    constructor(private http: HttpClient){}

    public userSubject = new Subject<UserModel[]>();
    private users: UserModel[] = [];


    getUserById(id: string): Observable<any>{
        console.log('in getUserById ', id)
        return this.http.get<{users: any}>(environment.apiUrl + '/usermodels', {params: {_id: id}})
    }

    getUsers(){
        console.log('in getUsers')
        this.http.get<{users: any}>(environment.apiUrl + '/usermodels', {params: {}})
        .pipe(map((responseData) => {
            console.log('responseData ', responseData)
            return responseData.users.map((user: {_id: string;
                email: string;
                password: string;
                firstname: string;
                lastname: string;
                phone: string;
                isAdmin: string}) => {
                return {
                    id: user._id,
                    email: user.email,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    isAdmin: user.isAdmin
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.users = updateResponse;
            this.userSubject.next(this.users);
        })
    }


}