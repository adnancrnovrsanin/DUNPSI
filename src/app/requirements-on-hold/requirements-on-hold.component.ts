import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProjectService } from '../_services/project.service';
import { GetRequirementsOnHoldRequest, Requirement } from '../_models/requirement';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-requirements-on-hold',
  templateUrl: './requirements-on-hold.component.html',
  styleUrls: ['./requirements-on-hold.component.css']
})
export class RequirementsOnHoldComponent implements OnInit {
  requirements: Requirement[] = [];
  user: User | null = null;
  selectedRequirement: Requirement | null = null;
  modalRef?: BsModalRef | null;

  editForm = new FormGroup({
    name: new FormControl(this.selectedRequirement?.name ?? '', [
      Validators.required,
    ]),
    description: new FormControl(this.selectedRequirement?.description ?? '', [
      Validators.required,
    ]),
  });

  get name() { return this.editForm.get('name'); }
  get description() { return this.editForm.get('description'); }

  constructor(private projectService: ProjectService, private accountService: AccountService, private router: Router, private toastr: ToastrService, private modalService: BsModalService) { 
    this.accountService.currentUser$.subscribe({
      next: (user: User | null) => {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    if (!this.user || !this.projectService.selectedProject) return;

    const request: GetRequirementsOnHoldRequest = {
      projectId: this.projectService.selectedProject.id ?? '',
      status: this.user.role === 'SOFTWARE_COMPANY' ? 'PENDING' : 'CHANGES_REQUIRED'
    };

    console.log(request);

    this.projectService.getRequirementsOnHold(request)?.subscribe({
      next: (requirements: Requirement[]) => {
        this.requirements = requirements;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updateRequirementStatus(requirementId: string, status: string) {
    this.projectService.updateRequirementStatus(requirementId, status).subscribe({
      next: () => {
        this.requirements = this.requirements.filter(r => r.id !== requirementId);
        this.toastr.success('Requirement status updated successfully');
        this.router.navigateByUrl('/projects/' + this.projectService.selectedProject?.id);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  openModal(template: TemplateRef<any>, requirement: Requirement) {
    this.name?.setValue(requirement.name)
    this.description?.setValue(requirement.description)
    this.selectedRequirement = requirement;
    this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-lg' });
  }

  closeModal(modalId?: number) {
    this.selectedRequirement = null;
    this.modalService.hide(modalId);
  }

  updateRequirement() {
    if (!this.selectedRequirement) return;
    this.selectedRequirement.name = this.name?.value ?? this.selectedRequirement.name;
    this.selectedRequirement.description = this.description?.value ?? this.selectedRequirement.description;
    this.projectService.updateRequirement(this.selectedRequirement).subscribe({
      next: () => {
        this.requirements = this.requirements.filter(r => r.id !== this.selectedRequirement?.id);
        this.toastr.success('Requirement updated successfully');
        this.closeModal();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
