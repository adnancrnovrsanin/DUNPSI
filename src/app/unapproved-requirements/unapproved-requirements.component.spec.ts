import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedRequirementsComponent } from './unapproved-requirements.component';

describe('UnapprovedRequirementsComponent', () => {
  let component: UnapprovedRequirementsComponent;
  let fixture: ComponentFixture<UnapprovedRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnapprovedRequirementsComponent]
    });
    fixture = TestBed.createComponent(UnapprovedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
