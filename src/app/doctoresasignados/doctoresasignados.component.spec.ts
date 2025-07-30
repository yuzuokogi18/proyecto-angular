import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctoresasignadosComponent } from './doctoresasignados.component';

describe('DoctoresasignadosComponent', () => {
  let component: DoctoresasignadosComponent;
  let fixture: ComponentFixture<DoctoresasignadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctoresasignadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctoresasignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
