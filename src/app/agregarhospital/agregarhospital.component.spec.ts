import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarhospitalComponent } from './agregarhospital.component';

describe('AgregarhospitalComponent', () => {
  let component: AgregarhospitalComponent;
  let fixture: ComponentFixture<AgregarhospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarhospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
