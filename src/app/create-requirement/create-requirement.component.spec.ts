import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequirementComponent } from './create-requirement.component';

describe('CreateRequirementComponent', () => {
  let component: CreateRequirementComponent;
  let fixture: ComponentFixture<CreateRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRequirementComponent]
    });
    fixture = TestBed.createComponent(CreateRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
