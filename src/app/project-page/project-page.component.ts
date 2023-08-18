import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../_services/project.service';
import { AccountService } from '../_services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  id: string | null;
  user: User | null = null;

  constructor(private projectService: ProjectService, public accountService: AccountService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { 
    this.id = this.route.snapshot.paramMap.get('id') ?? null;
  }

  ngOnInit(): void {
    if (this.id) this.projectService.getProject(this.id);
    this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
      }
    });
  }

  getTeamButtonText() {
    if (!this.user) return '';

    if (this.user.role === Role.PROJECT_MANAGER) return 'Manage Team';
    else if (this.user.role === Role.DEVELOPER) return 'View Team';
    else return '';
  }

  getRequirementsButtonText() {
    if (!this.user) return '';

    if (this.user.role === Role.PROJECT_MANAGER) return 'View requirements that need changes';
    else if (this.user.role === Role.SOFTWARE_COMPANY) return 'Check created requirements';
    else return '';
  }

  finishProject() {
    if (this.projectService.selectedProject) {
      this.projectService.markProjectAsFinished().subscribe({
        next: () => {
          this.router.navigateByUrl(`/`);
          this.toastr.success('Project finished successfully!');
        },
        error: (error) => {
          this.toastr.error(error);
          console.log(error);
        }
      });
    }
  }

  get project() { return this.projectService.selectedProject; }

  get canItBeFinished() { return this.projectService.canItBeFinished(); }

  goToTeamPage() {
    if (this.projectService.selectedProject) this.router.navigateByUrl(`/teams/${this.projectService.selectedProject.assignedTeam.id}`);
  }
}
