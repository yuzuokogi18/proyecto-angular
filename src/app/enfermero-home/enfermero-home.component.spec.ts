import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfermeroHomeComponent } from './enfermero-home.component';

describe('EnfermeroHomeComponent', () => {
  let component: EnfermeroHomeComponent;
  let fixture: ComponentFixture<EnfermeroHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfermeroHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfermeroHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
