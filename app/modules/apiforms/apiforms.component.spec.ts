import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiformsComponent } from './apiforms.component';

describe('ApiformsComponent', () => {
  let component: ApiformsComponent;
  let fixture: ComponentFixture<ApiformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
