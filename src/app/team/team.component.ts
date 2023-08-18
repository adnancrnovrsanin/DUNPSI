import { Component, OnInit } from '@angular/core';
import { TeamService } from '../_services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Developer } from '../_models/profiles';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  id: string | null;
  freeDevelopersList: Developer[] = [];
  selectedDevelopers: Developer[] = [];

  constructor(private teamService: TeamService, private route: ActivatedRoute, public accountService: AccountService, private router: Router, private toastr: ToastrService) { 
    this.id = this.route.snapshot.paramMap.get('id') ?? null;
  }

  ngOnInit(): void {
    if (this.id) {
      this.teamService.getTeam(this.id);
      this.teamService.getFreeDevelopers().subscribe({
        next: developers => {
          this.freeDevelopersList = developers;
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  get team() {
    return this.teamService.selectedTeam;
  }

  checkDeveloperCount() {
    if (this.team?.developers) {
      return this.team.developers.length > 0;
    } 
    return false;
  }

  developerClicked(developer: Developer) {
    if (this.selectedDevelopers.includes(developer)) {
      this.selectedDevelopers = this.selectedDevelopers.filter(d => d !== developer);
    } else {
      this.selectedDevelopers.push(developer);
    }
  }

  addDevelopers() {
    if (this.id) {
      this.teamService.assignDevelopers(this.id, this.selectedDevelopers).subscribe({
        next: () => {
          this.teamService.getTeam(this.id ?? '');
          this.selectedDevelopers = [];
          this.freeDevelopersList = this.freeDevelopersList.filter(d => !this.selectedDevelopers.includes(d));
          this.toastr.success('Developers added to team');
        },
        error: error => {
          console.log(error);
          this.toastr.error(error);
        }
      });
    }
  }
}
