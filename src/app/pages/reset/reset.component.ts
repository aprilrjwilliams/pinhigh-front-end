import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../service/auth-service";
import { RouterOutlet, RouterModule, ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
// import { setTimeout } from "timers/promises";

@Component({
  selector: "app-reset",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./reset.component.html",
  styleUrl: "./reset.component.css",
})
export class ResetComponent implements OnInit {
  public token: string | null | undefined = "";
  resetForm: FormGroup = new FormGroup({});
  public showSuccessMessage = false;
  public isLoading = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token");
    console.log("this.token", this.token);
    this.token = this.token?.replace(/,/g, ".");
    console.log("newToken ", this.token);

    this.resetForm = new FormGroup({
      password: new FormControl("", [Validators.required]),
    });
  }

  onSubmit(): void {
    this.resetForm?.disable();
    this.isLoading = true;

    console.log('in onsubmit ', this.resetForm)
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPassword(resetObj).subscribe({
      next: async (res) => {
        console.log('res ',res)
        if(res?.result){
          this.showSuccessMessage = true;
          console.log('isLoading ', this.isLoading)
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 4000);
        
        }
      }
    });
  }
}
