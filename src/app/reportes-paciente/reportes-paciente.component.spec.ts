import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPacienteComponent } from './reportes-paciente.component';

describe('ReportesPacienteComponent', () => {
  let component: ReportesPacienteComponent;
  let fixture: ComponentFixture<ReportesPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
