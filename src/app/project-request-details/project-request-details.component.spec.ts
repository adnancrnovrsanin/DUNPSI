import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequestDetailsComponent } from './project-request-details.component';

describe('ProjectRequestDetailsComponent', () => {
  let component: ProjectRequestDetailsComponent;
  let fixture: ComponentFixture<ProjectRequestDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectRequestDetailsComponent]
    });
    fixture = TestBed.createComponent(ProjectRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
