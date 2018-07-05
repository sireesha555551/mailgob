import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontactsComponent } from './addcontacts.component';

describe('AddcontactsComponent', () => {
  let component: AddcontactsComponent;
  let fixture: ComponentFixture<AddcontactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcontactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
