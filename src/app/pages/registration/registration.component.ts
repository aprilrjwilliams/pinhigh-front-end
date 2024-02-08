import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../service/auth-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-registration",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./registration.component.html",
  styleUrl: "./registration.component.css",
})
export class RegistrationComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService, private router: Router) {}

  //TODO add - - to phone number field restriction!!

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
    });

    // this.signupForm = new FormGroup({
    //   'email': new FormControl('', [Validators.required]),
    //   'password': new FormControl('', [Validators.required]),
    // })
  }

  onSubmit() {
    console.log("onSubmit ", this.signupForm.value);
    // let newUser: any = this.authService.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstname, this.signupForm.value.lastname, this.signupForm.value.phone);

    this.authService
      .signupUser(
        this.signupForm.value.email,
        this.signupForm.value.password,
        this.signupForm.value.firstname,
        this.signupForm.value.lastname,
        this.signupForm.value.phone
      )
      .subscribe((data) => {
        console.log("newUser ", data);
        //Route new user to login after signup
        if (data?.message == "User created") {
          this.router.navigate(["/members"]);
        }
      });
  }
}
