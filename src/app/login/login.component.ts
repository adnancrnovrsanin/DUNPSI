import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { LoginDto } from '../_dtos/AuthDtos';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validationErrors: string[] | undefined;
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private accountService: AccountService, private router: Router, private profileService: ProfileService) {}

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  login() {
    console.log(this.email?.value);
    console.log(this.password?.value);
    if (this.email?.value == null || this.password?.value == null) return;
    const loginCreds: LoginDto = {
      email: this.email.value,
      password: this.password.value,
    };

    this.accountService.login(loginCreds).subscribe({
      next: _ => {
        console.log('Login successful');
      },
      error: err => {
        console.log(err);
        this.validationErrors = err;
      }
    });
  }
}
