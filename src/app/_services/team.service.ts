import { Injectable } from '@angular/core';
import { DeveloperAssignmentRequest, Team } from '../_models/team';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Developer } from '../_models/profiles';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  baseUrl = 'http://localhost:5000/api/';
  selectedTeam: Team | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getTeam(id: string) {
    this.http.get<Team>(this.baseUrl + 'team/' + id).subscribe({
      next: team => {
        this.selectedTeam = team;
      },
      error: error => {
        console.log(error);
        this.toastr.error(error);
      }
    });
  }

  getFreeDevelopers() {
    return this.http.get<Developer[]>(this.baseUrl + 'developer/free-developers');
  }

  assignDevelopers(teamId: string, developers: Developer[]) {
    const request: DeveloperAssignmentRequest = {
      id: teamId,
      developers
    }
    return this.http.post<void>(this.baseUrl + 'team/developer-assignment', request);
  }

  clear() {
    this.selectedTeam = null;
  }
}
