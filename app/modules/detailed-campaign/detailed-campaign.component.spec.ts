import { DetailedCampaignComponent } from './detailed-campaign.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('DetailedCampaignComponent', () => {
  let component: DetailedCampaignComponent;
  let fixture: ComponentFixture<DetailedCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
