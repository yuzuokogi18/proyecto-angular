import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsdoctorComponent } from './patientsdoctor.component';

describe('PatientsdoctorComponent', () => {
  let component: PatientsdoctorComponent;
  let fixture: ComponentFixture<PatientsdoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsdoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsdoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
