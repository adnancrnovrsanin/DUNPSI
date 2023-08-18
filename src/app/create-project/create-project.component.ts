import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateInitialProjectRequest, InitialProjectRequest, InitialProjectRequestDto } from '../_models/projectRequest';
import { SoftwareCompanyService } from '../_services/software-company.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  projectCreateForm = new FormGroup({
    projectName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    projectDescription: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]),
    dueDate: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private softwareCompanyService: SoftwareCompanyService) { }

  get projectName() { return this.projectCreateForm.get('projectName'); }
  get projectDescription() { return this.projectCreateForm.get('projectDescription'); }
  get dueDate() { return this.projectCreateForm.get('dueDate'); }

  onSubmit() {
    const projectRequest: CreateInitialProjectRequest = {
      projectName: this.projectName?.value ?? '',
      projectDescription: this.projectDescription?.value ?? '',
      dueDate: this.getDateOnly(this.dueDate?.value ?? '') ?? "",
      rejected: false,
      clientId: this.softwareCompanyService.currentSoftwareCompany?.id ?? '',
    };

    this.softwareCompanyService.sendInitialProjectRequest(projectRequest);
    // console.log(projectRequest);
  }

  private getDateOnly(dueDate: string | undefined) {
    if (!dueDate) return;
    let theDueDate = new Date(dueDate);
    return new Date(theDueDate.setMinutes(theDueDate.getMinutes() - theDueDate.getTimezoneOffset()))
      .toISOString().slice(0, 10);
  }
}
