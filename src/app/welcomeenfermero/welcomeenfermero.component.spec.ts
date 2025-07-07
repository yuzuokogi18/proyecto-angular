import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeenfermeroComponent } from './welcomeenfermero.component';

describe('WelcomeenfermeroComponent', () => {
  let component: WelcomeenfermeroComponent;
  let fixture: ComponentFixture<WelcomeenfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeenfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeenfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
