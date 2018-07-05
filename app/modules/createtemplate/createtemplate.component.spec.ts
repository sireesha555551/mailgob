import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetemplateComponent } from './createtemplate.component';

describe('CreatetemplateComponent', () => {
  let component: CreatetemplateComponent;
  let fixture: ComponentFixture<CreatetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
