import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarenfermeroComponent } from './sidebarenfermero.component';

describe('SidebarenfermeroComponent', () => {
  let component: SidebarenfermeroComponent;
  let fixture: ComponentFixture<SidebarenfermeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarenfermeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarenfermeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
