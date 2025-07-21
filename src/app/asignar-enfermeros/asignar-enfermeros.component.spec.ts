import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarEnfermerosComponent } from './asignar-enfermeros.component';

describe('AsignarEnfermerosComponent', () => {
  let component: AsignarEnfermerosComponent;
  let fixture: ComponentFixture<AsignarEnfermerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarEnfermerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarEnfermerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
