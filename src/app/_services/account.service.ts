import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Role, User } from '../_models/user';
import { PresenceService } from './presence.service';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { SoftwareCompanyService } from './software-company.service';
import { CreateSoftwareCompanyCredentials, CreateSoftwareCompanyResponse, SoftwareCompanyDto } from '../_models/softwareCompany';
import { ProjectsService } from './projects.service';
import { ProjectService } from './project.service';
import { TeamService } from './team.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService, private profileService: ProfileService, private softwareCompanyService: SoftwareCompanyService, private projectsService: ProjectsService, private projectService: ProjectService, private teamService: TeamService, private router: Router) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.router.navigate(['/dashboard', user.id]);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  createSoftwareCompany(softwareCompanyCreds: CreateSoftwareCompanyCredentials) {
    return this.http.post<CreateSoftwareCompanyResponse>(this.baseUrl + 'account/register-company', softwareCompanyCreds).pipe(
      map(response => {
        if (response) {
          this.setCurrentUser(response.user);

          const softwareCompany: SoftwareCompanyDto = {
            id: response.id,
            appUserId: response.user.id,
            representativeName: response.user.name,
            representativeSurname: response.user.surname,
            email: response.user.email,
            companyName: response.companyName,
            address: response.address,
            contact: response.contact,
            web: response.web,
            currentProjects: []
          };

          this.softwareCompanyService.setCurrentSoftwareCompany(softwareCompany);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
    if (user.role !== Role.SOFTWARE_COMPANY) this.profileService.getProfile(user);
    if (user.role === Role.SOFTWARE_COMPANY) this.softwareCompanyService.getCompanyByEmail(user.email);
  }

  getUser(id: string) {
    return this.http.get<User>(this.baseUrl + 'account/' + id);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(this.baseUrl + 'account/email/' + email);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'photos/' + this.currentUserSource.getValue()?.id + '/setmain/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'photos/' + photoId);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
    this.profileService.logout();
    this.softwareCompanyService.clear();
    this.projectsService.clear();
    this.projectService.clear();
    this.teamService.clear();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }
}
