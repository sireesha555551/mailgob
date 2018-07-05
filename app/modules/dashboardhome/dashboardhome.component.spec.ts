import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardhomeComponent } from './dashboardhome.component';

describe('DashboardhomeComponent', () => {
  let component: DashboardhomeComponent;
  let fixture: ComponentFixture<DashboardhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
