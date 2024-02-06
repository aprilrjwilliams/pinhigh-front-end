import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  forgetForm: FormGroup = new FormGroup({});
  showSuccessMessage: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.forgetForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
    })
  }

  onSubmit(){
    this.forgetForm?.disable();
    this.isLoading = true;
    console.log('in onsubmit ', this.forgetForm)
    this.authService.sendEmail(this.forgetForm.value.email).subscribe({
      next: (res) => {
        console.log('res ',res)
        if(res){
          this.showSuccessMessage = true;
          this.isLoading = false;
          console.log('isLoading ', this.isLoading)
        }
      }
    })
  }

}
