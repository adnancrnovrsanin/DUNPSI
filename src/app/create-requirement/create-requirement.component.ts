import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateRequirementRequest, RequirementApproveStatus } from '../_models/requirement';
import { ProjectService } from '../_services/project.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.css']
})
export class CreateRequirementComponent implements OnInit {
  id: string | null;
  user: User | null = null;
  createRequirementForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ])
  });

  get name() { return this.createRequirementForm.get('name'); }
  get description() { return this.createRequirementForm.get('description'); }

  constructor(private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private projectService: ProjectService, private accountService: AccountService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  onSubmit() {
    if (this.user == null) return;

    const createRequirementRequest: CreateRequirementRequest = {
      name: this.name?.value ?? '',
      description: this.description?.value ?? '',
      projectId: this.id ?? '',
      status: (this.user.role === 'SOFTWARE_COMPANY') ? 'APPROVED' : 'PENDING',
      serialNumber: 0
    };

    this.projectService.createRequirement(createRequirementRequest).subscribe({
      next: () => {
        this.toastr.success('Requirement created!');
        this.router.navigate(['/projects', this.id]);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/projects', this.id]);
  }
}
