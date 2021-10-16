import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';
import { CustomvalidationService } from '../services/validation/customvalidation.service';

enum role {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER"
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  user: User = { "username": "", "email": "", "roles": ["user"], "password": "", "enabled": true };
  invalidLogin = false;
  submitted = false;
  showSuccessMsg: boolean = false;
  showErrorMsg: boolean = false;
  messageContent: string = "";
  loginResp: any;
  signupResp:any;
  
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthenticationService, private customValidator: CustomvalidationService) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
    this.registerForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, this.customValidator.noWhitespaceValidator()])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );
  }
  ngOnInit(): void {
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onClickSubmit() {  
      this.authService.login(this.loginForm.value).subscribe(resp => {
        this.loginResp = resp;
        this.authService.setData('tokenType', this.loginResp.tokenType);
        this.authService.setData('authToken', this.loginResp.accessToken);
        this.authService.setData('username', this.loginResp.username);
        let userRoles: Array<string> = this.loginResp.roles;
        this.invalidLogin = false;
        if (userRoles.includes(role.admin)) {
          this.router.navigate(["dashboard"]);
        } else {
          this.router.navigate(["home"]);
        }
      },
        (err) => {
          console.log("Invalid User Credentials..");
          this.messageContent = err.error.message;
          this.invalidLogin = true;
        });
      this.loginForm.reset();
  }
  onRegister() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.user.username = this.registerForm.controls['username'].value;
      this.user.email = this.registerForm.controls['email'].value;
      this.user.password = this.registerForm.controls['password'].value;
      this.authService.signUp(this.user).subscribe(resp => {
        this.signupResp = resp;
        this.messageContent = this.signupResp.message;
        this.showSuccessMsg = true;
        this.router.navigate([""]);
      },
      (err) => {
        this.messageContent = err.error.message;
        this.showErrorMsg = true;
        this.router.navigate([""]);
      });
      this.registerForm.reset();
      for (let control in this.registerForm.controls) {
        this.registerForm.controls[control].setErrors(null);
      }
    }
  }



  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }



  }
}