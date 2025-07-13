import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermeroLoginComponent } from './enfermero-login.component';

describe('EnfermeroLoginComponent', () => {
  let component: EnfermeroLoginComponent;
  let fixture: ComponentFixture<EnfermeroLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfermeroLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfermeroLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
