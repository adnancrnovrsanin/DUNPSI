import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistoryComponent } from './project-history.component';

describe('ProjectHistoryComponent', () => {
  let component: ProjectHistoryComponent;
  let fixture: ComponentFixture<ProjectHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectHistoryComponent]
    });
    fixture = TestBed.createComponent(ProjectHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
