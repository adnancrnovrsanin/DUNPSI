import { Component } from '@angular/core';
import { ProjectService } from '../_services/project.service';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: User | null = null;

  constructor(public accountService: AccountService, private projectService: ProjectService, private router: Router) {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  link() {
    if (this.projectService.selectedProject) this.router.navigateByUrl(`/projects/${this.projectService.selectedProject.id}`);
  }
}
