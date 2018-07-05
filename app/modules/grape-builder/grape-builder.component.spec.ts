import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrapeBuilderComponent } from './grape-builder.component';

describe('GrapeBuilderComponent', () => {
  let component: GrapeBuilderComponent;
  let fixture: ComponentFixture<GrapeBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrapeBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrapeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
