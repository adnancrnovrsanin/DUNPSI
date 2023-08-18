import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private projectService: ProjectService, private route: ActivatedRoute, public accountService: AccountService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.projectService.getProjectPhases(this.id);
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
}
