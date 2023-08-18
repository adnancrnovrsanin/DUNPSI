import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { ProjectService } from '../_services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Requirement } from '../_models/requirement';
import { ProjectPhase, UpdateRequirementLayoutRequest } from '../_models/projectPhase';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Developer } from '../_models/profiles';
import { TeamService } from '../_services/team.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, NgFor, CdkDrag, NgIf, AsyncPipe],
})
export class KanbanBoardComponent implements OnInit {
  id: string | null = null;
  editMode: boolean = false;
  savedProjectPhases: ProjectPhase[] = [];
  editPhasesMode: boolean = false;
  user: User | null = null;
  modalRef?: BsModalRef | null;
  selectedRequirement?: Requirement | null = null;
  freeDevelopers: Developer[] = [];
  selectedDevelopers: Developer[] = [];

  constructor(private projectService: ProjectService, private route: ActivatedRoute, public accountService: AccountService, private modalService: BsModalService, private teamService: TeamService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      }
    });
    
  }

  ngOnInit(): void {
    if (this.id) {
      this.projectService.getProjectPhases(this.id);
      this.teamService.getFreeDevelopersForProjectTasks(this.id).subscribe({
        next: (developers) => {
          this.freeDevelopers = developers;
        }
      });
    }
  }

  get projectPhases() {
    return this.projectService.selectedProjectPhases;
  }

  drop(event: CdkDragDrop<Requirement[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // this.projectService.updateRequirementPhase(event.container.data[event.currentIndex].id, event.container.id);
    console.log(this.projectPhases);
  }

  turnOnEditMode() {
    this.editMode = true;
    this.savedProjectPhases = this.projectPhases;
  }

  cancelEditMode() {
    this.editMode = false;
    window.location.reload();
  }

  saveNewLayoutChanges() {
    if (this.id == null) return;
    const request: UpdateRequirementLayoutRequest = {
      projectId: this.id,
      projectPhases: this.projectPhases,
    }
    this.projectService.updateRequirementLayout(request);
    this.editMode = false;
  }

  letRequirementBeClicked(requirement: Requirement) {
    if (!this.user) return false;
    if (this.user.role !== 'PROJECT_MANAGER') return false;
    this.selectedRequirement = requirement;
    return true; 
  }

  developerClicked(developer: Developer) {
    if (this.selectedDevelopers.includes(developer)) {
      this.selectedDevelopers = this.selectedDevelopers.filter((dev) => dev !== developer);
    } else {
      this.selectedDevelopers.push(developer);
    }
  }

  assignDevelopers() {
    if (!this.selectedRequirement || !this.selectedDevelopers.length) return;
    this.selectedRequirement.assignedDevelopers = this.selectedDevelopers;
    this.projectService.assignDevelopersToRequirement(this.selectedRequirement).subscribe({
      next: () => {
        this.closeModal(1);
        this.selectedDevelopers = [];
        this.selectedRequirement = null;
        // window.location.reload();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-lg' });
  }

  closeModal(modalId?: number) {
    this.selectedDevelopers = [];
    this.modalService.hide(modalId);
  }
}
