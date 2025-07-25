import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDoctorComponent } from './registro-doctor.component';

describe('RegistroDoctorComponent', () => {
  let component: RegistroDoctorComponent;
  let fixture: ComponentFixture<RegistroDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
