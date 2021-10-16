import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return {};
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? {} : { invalidPassword: true };
    };
  }

  public noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return {};
      }
      const valid = control.value.indexOf(' ') >= 0;
      return valid ? { invalidSpace: true } : {};
    };
  }

  MatchPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];


        if (!control || !matchingControl) {
          return ;
        }
  
        if (matchingControl.errors && !matchingControl.errors.passwordMismatch) {
          return ;
        }
  
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ passwordMismatch: true });
        } else {
          matchingControl.setErrors(null);
        }

    }

  }



}
