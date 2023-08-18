import { Component, OnInit } from '@angular/core';
import { SoftwareCompanyService } from '../_services/software-company.service';
import { SoftwareCompany } from '../_models/softwareCompany';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  constructor(private softwareCompanyService: SoftwareCompanyService) { }

  ngOnInit(): void {
    this.softwareCompanyService.getCompanyProjects();
  }

  get softwareCompany() {
    return this.softwareCompanyService.currentSoftwareCompany;
  }

  get companyProjects() {
    return this.softwareCompanyService.currentSoftwareCompany?.currentProjects;
  }
}
