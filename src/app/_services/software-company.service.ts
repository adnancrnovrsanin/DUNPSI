import { Injectable } from '@angular/core';
import { CreateSoftwareCompanyCredentials, CreateSoftwareCompanyResponse, SoftwareCompany, SoftwareCompanyDto } from '../_models/softwareCompany';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { AccountService } from './account.service';
import { Project, ProjectDto } from '../_models/softwareProject';
import { CreateInitialProjectRequest, InitialProjectRequestDto } from '../_models/projectRequest';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SoftwareCompanyService {
  baseUrl = 'http://localhost:5000/api/';
  currentSoftwareCompany: SoftwareCompany | null = null;
  companyProjects: Project[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  getCompanyByEmail(email: string) {
    return this.http.get<SoftwareCompanyDto>(this.baseUrl + 'softwareCompany/email/' + email).subscribe({
      next: (softwareCompany: SoftwareCompanyDto) => {
        if (softwareCompany) {
          this.setCurrentSoftwareCompany(softwareCompany);
        }
      }
    });
  }

  setCurrentSoftwareCompany(softwareCompany: SoftwareCompanyDto) {
    const company: SoftwareCompany = {
      id: softwareCompany.id,
      appUserId: softwareCompany.appUserId,
      representativeName: softwareCompany.representativeName,
      representativeSurname: softwareCompany.representativeSurname,
      email: softwareCompany.email,
      companyName: softwareCompany.companyName,
      address: softwareCompany.address,
      contact: softwareCompany.contact,
      web: softwareCompany.web,
      currentProjects: softwareCompany.currentProjects.map(project => {
        return {
          id: project.id,
          name: project.name,
          clientId: project.clientId,
          description: project.description,
          finished: project.finished,
          assignedTeamId: project.assignedTeamId,
          dueDate: new Date(project.dueDate),
          assignedTeam: project.assignedTeam
        }
      })
    }

    this.currentSoftwareCompany = company;
  }

  getCompanyProjects() {
    if (this.currentSoftwareCompany === null) {
      return;
    }
    return this.http.get<ProjectDto[]>(this.baseUrl + 'softwareCompany/projects/' + this.currentSoftwareCompany.id).subscribe({
      next: (projects: ProjectDto[]) => {
        console.log(projects);
        for (let i = 0; i < projects.length; i++) {
          this.companyProjects.push({
            id: projects[i].id,
            name: projects[i].name,
            clientId: projects[i].clientId,
            description: projects[i].description,
            finished: projects[i].finished,
            assignedTeamId: projects[i].assignedTeamId,
            dueDate: new Date(projects[i].dueDate),
            assignedTeam: projects[i].assignedTeam
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  sendInitialProjectRequest(projectRequest: CreateInitialProjectRequest) {
    return this.http.post<void>(this.baseUrl + 'softwareproject/initial-request', projectRequest).subscribe({
      next: () => {
        this.toastr.success('Project request sent');
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.toastr.error(error);
        console.log(error);
      }
    })
  }

  clear() {
    this.currentSoftwareCompany = null;
    this.companyProjects = [];
  }
}
