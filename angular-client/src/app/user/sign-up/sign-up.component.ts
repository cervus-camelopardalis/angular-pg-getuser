import { Component, OnInit } from '@angular/core';

import { UntypedFormGroup } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  hide = true;

  formSignUp = new UntypedFormGroup({
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new UntypedFormControl('', [
      Validators.required
    ])
  });

  getErrorMessageEmail() {
    if (this.formSignUp.controls['email'].hasError('required')) {
      return 'E-mail is required';
    }

    return this.formSignUp.controls['email'].hasError('pattern') ? 'Not a valid e-mail' : '';
  }

  getErrorMessagePassword() {
    return this.formSignUp.controls['password'].hasError('required') ? 'Password is required' : '';
  }

  /* ABOVE THIS: Error messages for better UX */
  /*************************************************************************************************/
  /*************************************************************************************************/
  /*************************************************************************************************/
  /* BELOW THIS: Subscription and communication with backend (i.e., Express server) */
  /* BELOW THIS: Redirection to the Sign in component and opening of the snackbar */

  emailFromTheForm: string = '';
  passwordFromTheForm: string = '';
  router: any;
  
  onSubmitSignUp() {
    const signupObserver = {
      next: (x: any) => {
        console.log('Observer got a next value: ' + 'Sign up successful');

        this.signupRouter.navigate(['/sign-up-successful']).then((navigated: boolean) => {
          if (navigated) {
            this.snackBar.open('Sign up successful', 'Close', { duration: 5000, panelClass: ['my-green-snackbar'] });
          }
        });
      },

      error: (err: any) => {
        console.log('Observer got an error: ' + err.status); /* Log error status */
        /* console.log('Observer got an error: ' + err.message); */

        /* If you get ERROR 409 (i.e., e-mail already exists in database)... */
        if (err.status == 409) {
          /* ...navigate to the Sign in component so that the user can sign in...  */
          this.signupRouter.navigate(['/already-signed-up']).then((navigated: boolean) => {
            if (navigated) {
              /* ...and open the snackbar */
              this.snackBar.open('You have already signed up with this e-mail, please sign in', 'Close', { duration: 5000, panelClass: ['my-red-snackbar-1'] }); /* CSS style added in styles.scss (global) */
            }
          });
        }
      },

      complete: () => {
        console.log('Observer got a complete notification');
      }

    };

    this.authService.signup(this.formSignUp.value).subscribe(signupObserver);
  }

  constructor(private authService: AuthService, private signupRouter: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
