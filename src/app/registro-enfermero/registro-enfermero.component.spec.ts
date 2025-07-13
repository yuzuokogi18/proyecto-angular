import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEnfermeroComponent } from './registro-enfermero.component';

describe('RegistroEnfermeroComponent', () => {
  let component: RegistroEnfermeroComponent;
  let fixture: ComponentFixture<RegistroEnfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEnfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEnfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
