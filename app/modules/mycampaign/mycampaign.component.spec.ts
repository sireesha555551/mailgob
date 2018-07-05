import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCampaignComponent } from './mycampaign.component';

describe('MyCampaignComponent', () => {
  let component: MyCampaignComponent;
  let fixture: ComponentFixture<MyCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
