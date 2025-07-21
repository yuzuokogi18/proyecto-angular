import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebardoctorComponent } from './sidebardoctor.component';

describe('SidebardoctorComponent', () => {
  let component: SidebardoctorComponent;
  let fixture: ComponentFixture<SidebardoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebardoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebardoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
