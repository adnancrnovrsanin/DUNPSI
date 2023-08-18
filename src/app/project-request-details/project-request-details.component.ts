import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../_services/projects.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SelectionChange } from '@angular/cdk/collections';
import { ProjectCreateDto } from '../_models/softwareProject';

@Component({
  selector: 'app-project-request-details',
  templateUrl: './project-request-details.component.html',
  styleUrls: ['./project-request-details.component.css'],
})
export class ProjectRequestDetailsComponent implements OnInit {
  id: string | null = null;
  selectedManager: string | null = null;

  constructor(private projectsService: ProjectsService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.projectsService.getProjectRequest(this.id);
      this.projectsService.getfreeProjectManagersForProject();
    }
  }

  get projectRequest() {
    return this.projectsService.selectedProjectRequest;
  }

  get freeProjectManagers() {
    return this.projectsService.projectManagers;
  }

  setSelectedValue($event: any) {
    this.selectedManager = $event.target.value;
  }

  acceptProject() {
    if (this.id && this.selectedManager) {
      const projectCreateRequest: ProjectCreateDto = {
        projectRequestId: this.id,
        assignedProjectManager: this.selectedManager,
      };

      this.projectsService.createProjectRequest(projectCreateRequest);
    }
  }

  rejectRequest() {
    if (this.id) {
      this.projectsService.rejectProjectRequest(this.id);
    }
  }
}
