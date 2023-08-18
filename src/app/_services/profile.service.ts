import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Developer, ProductManager, ProjectManager } from '../_models/profiles';
import { HttpClient } from '@angular/common/http';
import { Role, User } from '../_models/user';
import { ProjectService } from './project.service';
import { ProjectDto } from '../_models/softwareProject';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.apiUrl;
  private currentDeveloperSource = new BehaviorSubject<Developer | null>(null);
  currentDeveloper$ = this.currentDeveloperSource.asObservable();

  private currentProductManagerSource = new BehaviorSubject<ProductManager | null>(null);
  currentProductManager$ = this.currentProductManagerSource.asObservable();

  private currentProjectManagerSource = new BehaviorSubject<ProjectManager | null>(null);
  currentProjectManager$ = this.currentProjectManagerSource.asObservable();

  constructor(private http: HttpClient, private projectService: ProjectService, private toastr: ToastrService) { }

  getDeveloper(userId: string) {
    return this.http.get<Developer>(this.baseUrl + 'developer/' + userId);
  }

  getProductManager(userId: string) {
    return this.http.get<ProductManager>(this.baseUrl + 'productmanager/' + userId);
  }

  getProjectManager(userId: string) {
    return this.http.get<ProjectManager>(this.baseUrl + 'projectmanager/' + userId);
  }

  getSoftwareCompany(userId: string) {
    return this.http.get(this.baseUrl + 'softwarecompany/' + userId);
  }

  setCurrentDeveloper(developer: Developer) {
    this.currentDeveloperSource.next(developer);
  }

  setCurrentProductManager(productManager: ProductManager) {
    this.currentProductManagerSource.next(productManager);
  }

  setCurrentProjectManager(projectManager: ProjectManager) {
    this.currentProjectManagerSource.next(projectManager);
  }

  getProfile(user: User) {
    if (user.role === Role.DEVELOPER) {
      this.getDeveloper(user.id).subscribe(developer => {
        this.setCurrentDeveloper(developer);
        this.getCurrentProject(this.baseUrl + 'developer/current-project/' + developer.id);
      })
    }
    else if (user.role === Role.PRODUCT_MANAGER) {
      this.getProductManager(user.id).subscribe(productManager => {
        this.setCurrentProductManager(productManager);
      })
    }
    else if (user.role === Role.PROJECT_MANAGER) {
      this.getProjectManager(user.id).subscribe(projectManager => {
        this.setCurrentProjectManager(projectManager);
        this.getCurrentProject(this.baseUrl + 'projectmanager/current-project/' + projectManager.id);
      })
    }
  }

  logout() {
    this.currentDeveloperSource.next(null);
    this.currentProductManagerSource.next(null);
    this.currentProjectManagerSource.next(null);
  }

  getCurrentProject(url: string) {
    return this.http.get<ProjectDto | null>(url).subscribe({
      next: (project: ProjectDto | null) => {
        if (project === null) return;
        this.projectService.selectedProject = {
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
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error);
      }
    });
  }
}
