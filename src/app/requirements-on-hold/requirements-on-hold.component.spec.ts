import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsOnHoldComponent } from './requirements-on-hold.component';

describe('RequirementsOnHoldComponent', () => {
  let component: RequirementsOnHoldComponent;
  let fixture: ComponentFixture<RequirementsOnHoldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementsOnHoldComponent]
    });
    fixture = TestBed.createComponent(RequirementsOnHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
