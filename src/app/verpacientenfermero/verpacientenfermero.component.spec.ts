import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerpacientenfermeroComponent } from './verpacientenfermero.component';

describe('VerpacientenfermeroComponent', () => {
  let component: VerpacientenfermeroComponent;
  let fixture: ComponentFixture<VerpacientenfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerpacientenfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerpacientenfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
