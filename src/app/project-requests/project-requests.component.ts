import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../_services/projects.service';
import { InitialProjectRequest } from '../_models/projectRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.css']
})
export class ProjectRequestsComponent implements OnInit {

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProjectRequests();
  }

  get projectRequests() {
    return this.projectsService.projectRequests;
  }

  link(projectRequest: InitialProjectRequest) {
    this.router.navigate(['/projects/requests', projectRequest.id]);
  }
}
