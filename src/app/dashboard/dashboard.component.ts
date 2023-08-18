import { Component } from '@angular/core';
import { ProjectService } from '../_services/project.service';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userIsManager: boolean = false;

  constructor(public accountService: AccountService, private projectService: ProjectService, private router: Router) {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.userIsManager = user?.role === "PROJECT_MANAGER";
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
