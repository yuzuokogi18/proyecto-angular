import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivosdoctorComponent } from './dispositivosdoctor.component';

describe('DispositivosdoctorComponent', () => {
  let component: DispositivosdoctorComponent;
  let fixture: ComponentFixture<DispositivosdoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivosdoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispositivosdoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
