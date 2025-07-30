import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermerosAsignadosComponent } from './enfermeros-asignados.component';

describe('EnfermerosAsignadosComponent', () => {
  let component: EnfermerosAsignadosComponent;
  let fixture: ComponentFixture<EnfermerosAsignadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfermerosAsignadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfermerosAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
