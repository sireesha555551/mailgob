import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubComponent } from './unsub.component';

describe('UnsubComponent', () => {
  let component: UnsubComponent;
  let fixture: ComponentFixture<UnsubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
