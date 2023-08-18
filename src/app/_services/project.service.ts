import { Injectable } from '@angular/core';
import { Project, ProjectDto } from '../_models/softwareProject';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectPhase, UpdateRequirementLayoutRequest } from '../_models/projectPhase';
import { CreateRequirementRequest } from '../_models/requirement';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = 'http://localhost:5000/api/';
  selectedProject: Project | null = null;
  selectedProjectPhases: ProjectPhase[] = [];

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getProject(id: string) {
    return this.http.get<ProjectDto>(this.baseUrl + 'softwareProject/' + id).subscribe({
      next: (project: ProjectDto) => {
        this.selectedProject = {
          id: project.id,
          clientId: project.clientId,
          name: project.name,
          description: project.description,
          dueDate: new Date(project.dueDate),
          finished: project.finished,
          assignedTeamId: project.assignedTeamId,
          assignedTeam: project.assignedTeam
        };
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    });
  }

  getProjectSubscription(id: string) {
    return this.http.get<ProjectDto>(this.baseUrl + 'softwareProject/' + id);
  }

  getProjectPhases(id: string) {
    return this.http.get<ProjectPhase[]>(this.baseUrl + 'softwareProject/project-phases/' + id).subscribe({
      next: (projectPhases: ProjectPhase[]) => {
        for(let i = 0; i < projectPhases.length; i++) {
          projectPhases[i].requirements = projectPhases[i].requirements.sort((a, b) => a.serialNumber - b.serialNumber);
        }
        this.selectedProjectPhases = projectPhases.sort((a, b) => a.serialNumber - b.serialNumber);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    });
  }

  createRequirement(request: CreateRequirementRequest) {
    return this.http.post(this.baseUrl + 'requirements', request);
  }

  updateRequirementLayout(request: UpdateRequirementLayoutRequest) {
    for (let i = 0; i < request.projectPhases.length; i++) {
      const projectPhase = request.projectPhases[i];
      for (let j = 0; j < projectPhase.requirements.length; j++) {
        const requirement = projectPhase.requirements[j];
        requirement.serialNumber = j;
      }
    }
    return this.http.put<void>(this.baseUrl + 'softwareProject/project-phases/requirement-layout', request).subscribe({
      next: () => {
        this.toastr.success('Requirement layout updated successfully');
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    });
  }

  canItBeFinished() {
    let canItBeFinished = true;
    for (let phase in this.selectedProjectPhases) {
      if (this.selectedProjectPhases[phase].requirements.length > 0 && this.selectedProjectPhases[phase].name !== 'Done') {
        canItBeFinished = false;
        break;
      }
    }
    return canItBeFinished;
  }

  clear() {
    this.selectedProject = null;
    this.selectedProjectPhases = [];
  }
}
