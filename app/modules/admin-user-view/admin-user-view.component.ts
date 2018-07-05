import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { AdminDashboardService } from '../admin-dashboard/admin-dashboard.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-admin-user-view',
  templateUrl: './admin-user-view.component.html',
  styleUrls: ['./admin-user-view.component.scss']
})
export class AdminUserViewComponent implements OnInit {
	userId: any;
	page_no: any = 1;
	campaigns: any;
	totalContacts: any;
	totalCampaigns: any;
	isPageLoaded: boolean = false;
  page: any;
  constructor(
  	private activatedRoute: ActivatedRoute,
  	private adminDashboardService: AdminDashboardService,
  	private commonService: CommonService) { }

  ngOnInit() {
  	this.activatedRoute.queryParams.subscribe(params => {
  		this.userId = params["id"];
  	})
  	this.getUserStatistics();
  	this.commonService.makeTawkHide();
  }
  getUserStatistics(){	
  	if(this.userId){
  		this.adminDashboardService.getUserCampaignsInfo(this.userId,this.page_no)
  		.subscribe(resp => {
  			if(resp.status){
  				this.isPageLoaded = true;
  				this.campaigns = resp.message.campaignInfo.campaign_data;
  				this.totalContacts = resp.message.contacts_count.count;
  				this.totalCampaigns = resp.message.campaignInfo.total_campaign_count
  			}else{
  			    this.isPageLoaded = false;
  			}
  		})
  	}else{

  	}

  }
  public getServerData(event){
		this.page_no = event;
		this.adminDashboardService.getUserCampaignsInfo(this.userId,this.page_no).subscribe(
			response =>{
				if(response.status) { 
					this.campaigns = [];
					this.campaigns = response.message.campaignInfo.campaign_data;
				} else {
					alert('Max page number limit Executed');
				}
			},
			error =>{
				alert('Server error');
			}
			);
		return event;
	}

}
