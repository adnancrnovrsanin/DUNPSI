import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ProjectsService } from '../_services/projects.service';
import { User } from '../_models/user';
import { Project, ProjectDto } from '../_models/softwareProject';
import { Router } from '@angular/router';
import { ProfileService } from '../_services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectManager } from '../_models/profiles';

@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  styleUrls: ['./project-history.component.css']
})
export class ProjectHistoryComponent implements OnInit {
  user: User | null = null;
  projectManager: ProjectManager | null = null;
  projectHistory: Project[] = [];

  constructor(private accountService: AccountService, private projectsService: ProjectsService, private toastr: ToastrService, private router: Router, private profileService: ProfileService) {
    this.accountService.currentUser$.subscribe(user => this.user = user);
    this.profileService.currentProjectManager$.subscribe(projectManager => this.projectManager = projectManager);
  }

  ngOnInit(): void {
    console.log("Ne radi 0");
    if (!this.user) {
      console.log("Ne radi 1");
      return;
    }
    if (this.user.role !== 'PROJECT_MANAGER') {
      console.log("Ne radi 2");
      return;
    }
    if (!this.projectManager) {
      console.log("Ne radi 3");
      return;
    }
    console.log("Proslo");

    this.projectsService.getProjectHistory(this.projectManager.id).subscribe({
      next: (projectHistory: ProjectDto[]) => {
        this.projectHistory = projectHistory.map(project => {
          return {
            id: project.id,
            clientId: project.clientId,
            name: project.name,
            description: project.description,
            dueDate: new Date(project.dueDate),
            finished: project.finished,
            assignedTeamId: project.assignedTeamId,
            assignedTeam: project.assignedTeam
          };
        });
      },
      error: (error: any) => {
        this.toastr.error(error.error);
        console.log(error);
      }
    });
  }
}
