import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { LoginDto } from '../_dtos/AuthDtos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private accountService: AccountService, private router: Router) {}

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  login() {
    if (this.email?.value == null || this.password?.value == null) return;
    const loginCreds: LoginDto = {
      email: this.email.value,
      password: this.password.value,
    };

    this.accountService.login(loginCreds).subscribe({
      next: _ => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
