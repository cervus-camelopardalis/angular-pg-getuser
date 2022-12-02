import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  hide = true;

  formSignIn = new FormGroup({
    email: new FormControl('', [
      Validators.required /* E-mail is required (i.e., user must enter e-mail otherwise the form is invalid --> button disabled) */
    ]),
    password: new FormControl('', [
      Validators.required /* Password is required (i.e., user must enter password otherwise the form is invalid --> button disabled) */
    ])
  });

  /* Function for e-mail errors */
  getErrorMessageEmail() {
    return this.formSignIn.controls['email'].hasError('required') ? 'E-mail is required' : '';
  }

  /* Function for password errors */
  getErrorMessagePassword() {
    return this.formSignIn.controls['password'].hasError('required') ? 'Password is required' : '';
  }

  /* ABOVE THIS: Error messages for better UX */
  /*************************************************************************************************/
  /*************************************************************************************************/
  /*************************************************************************************************/
  /* BELOW THIS: Subscription and communication with backend (i.e., Express server) */
  /* BELOW THIS: Redirection to the Dashboard component */

  test = false;
    
  onSubmitSignIn() {
    /* https://angular.io/guide/observables#subscribing */
    /* Create observer object */
    const signinObserver = {

      /* If everything is OK (i.e., user sign in successful)... */
      next: (x: any) => {
        console.log('Observer got a next value: ' + 'Sign in successful');

        /* ...navigate to the Dashboard component */
        this.signinRouter.navigate(['/sign-in-successful']);
      },

      /* If there is an error (i.e., user sign in unsuccessful) */
      error: (err: any) => {
        console.log('Observer got an error: ' + err.status); /* Log error status */

        /* If you get ERROR 400 (i.e., incorrect e-mail OR incorrect password)... */
        if (err.status == 400) {
          console.log('Incorrect e-mail or password');

          /* ...open the snackbar */
          this.snackBar.open('Incorrect e-mail or password, please sign in again', 'Close', { duration: 5000, panelClass: ['my-red-snackbar-2'] }); /* CSS style added in styles.scss (global) */       
        }
      },

      /* If there are no errors and the subscription for that particular Observable is complete */
      /* NOTE: If the complete value is sent, nothing else can be delivered to the Observable */
      complete: () => {
        console.log('Observer got a complete notification');
      }

    };

    /* Subscribe and communicate with backend (i.e., Express server) */
    this.authService.signin(this.formSignIn.value).subscribe(signinObserver);
  }

  constructor(private authService: AuthService, private signinRouter: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
