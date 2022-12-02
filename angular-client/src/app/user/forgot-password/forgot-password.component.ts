import { Component, OnInit } from '@angular/core';

import { UntypedFormGroup } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  formForgotPassword = new UntypedFormGroup({
    "email": new UntypedFormControl("", Validators.required),
  });
    
  onSubmitForgotPassword() {
    console.log("Forgot password: Reactive form submitted ✓");
    console.log(this.formForgotPassword.value);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
