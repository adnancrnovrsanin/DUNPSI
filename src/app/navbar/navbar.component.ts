import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role, User } from '../_models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  model: any = {};
  currentUser: User | null = null;

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: user => {
        if (user) {
          this.currentUser = user;
        }
      }
    });
  }

  goToDashboard() {
    this.router.navigateByUrl(`/dashboard/${this.currentUser?.id}`);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
