import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Developer, ProductManager, ProjectManager } from '../_models/profiles';
import { HttpClient } from '@angular/common/http';
import { Role, User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = "http://localhost:5000/api/";
  private currentDeveloperSource = new BehaviorSubject<Developer | null>(null);
  currentDeveloper$ = this.currentDeveloperSource.asObservable();

  private currentProductManagerSource = new BehaviorSubject<ProductManager | null>(null);
  currentProductManager$ = this.currentProductManagerSource.asObservable();

  private currentProjectManagerSource = new BehaviorSubject<ProjectManager | null>(null);
  currentProjectManager$ = this.currentProjectManagerSource.asObservable();

  constructor(private http: HttpClient) { }

  getDeveloper(userId: string) {
    return this.http.get<Developer>(this.baseUrl + 'developer/' + userId);
  }

  getProductManager(userId: string) {
    return this.http.get<ProductManager>(this.baseUrl + 'productmanager/' + userId);
  }

  getProjectManager(userId: string) {
    return this.http.get<ProjectManager>(this.baseUrl + 'projectmanager/' + userId);
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
      })
    }
  }

  logout() {
    this.currentDeveloperSource.next(null);
    this.currentProductManagerSource.next(null);
    this.currentProjectManagerSource.next(null);
  }
}
