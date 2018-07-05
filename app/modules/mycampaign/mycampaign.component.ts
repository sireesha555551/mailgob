import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {MyCampaignService} from './mycampaign.service';
import * as moment from 'moment'; // add this 1 of 4
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import {CommonService} from '../common.service';
import { CookieService } from 'ngx-cookie-service';
import {AlertsService} from '../alerts/alerts.service';
import {AuthService} from '../auth.service';



@Component({
	selector: 'app-mycampaign',
	templateUrl: './mycampaign.component.html',
	styleUrls: ['./mycampaign.component.scss']
})
export class MyCampaignComponent implements OnInit {
	token: any;
	data =  {
		token: "",
		page_no: '',
		type: 'all'
	}
	campaignObj = {
		token: "",
		campaign_id:""
	}
	totalItems: number = 40;
	campaigns:any =[];
	isPageLoaded: boolean = false;
	allCampaigns : any = [];
	isCampaignsEmpty: boolean = false;
	isDataLoaded: boolean = false;
	selectedFilter: any = "all";
	constructor(
		private mycampaignService: MyCampaignService,
		private commonService: CommonService,
		private router: Router,
		private cookieService: CookieService,
		private alertsService: AlertsService,
		private authService: AuthService){}
	ngOnInit() {
		this.alertsClear();
		if(this.cookieService.get('token')){
			this.getUserData();
			this.commonService.makeTawkHide();
		}else{
			this.router.navigate(['/login']);
		}
	}
	getUserData(){
		this.commonService.getUserData()
		this.token = this.cookieService.get('token');
		if(this.token){
			this.getAllCampaignsData(1)
		}
	}
	getAllCampaignsData(page_no){
		this.data.token = this.token;
		this.data.page_no = page_no;
		this.mycampaignService.getAllCampaignsData(this.data)
		.subscribe(response => {
			if(response.status){
				var resp = response;
				this.isDataLoaded = true;
				this.campaigns = resp.message.campaign_data;
				this.isPageLoaded = true;
				this.totalItems = (resp.message.total_page_count * 10);
				// (response.message.total_page_count * 10);
				this.allCampaigns = this.campaigns;
				this.getDateAndColor(this.campaigns);
			}
			else{
				this.isCampaignsEmpty = true;
				this.isDataLoaded = true;
			}
		})
	}
	public getServerData(event){
		this.data.token = this.token;
		this.data.page_no = event
		this.mycampaignService.getAllCampaignsData(this.data).subscribe(
			response =>{
				if(response.status) { 
					this.campaigns = [];
					this.campaigns = response.message.campaign_data;
					this.totalItems = (response.message.total_page_count * 10);
					this.getDateAndColor(response.message.campaign_data);
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
	getDateAndColor(campaigns){
		for(var i = 0 ; i < campaigns.length ; i++){
			var date = campaigns[i].created_on.split(" ")[0];
			date = date.split('-');
			campaigns[i].created_date = date[2] +  ' ' +moment(date[1].toString(), 'MM').format('MMMM').substring(0, 3) + ',  '+ date[0];
			if(campaigns[i].status == "Campaign Initiated"){
				campaigns[i].color = "#00E21B";
				campaigns[i].statusText = "Sent";
				campaigns[i].isAllowToResend = true;
			}else if(campaigns[i].status == "Draft"){
				campaigns[i].statusText = "Draft";
				campaigns[i].draft = true;
				campaigns[i].color = "blue";
			}else if(campaigns[i].status =="Created"){
				campaigns[i].color = "#ff0056";
				campaigns[i].pending = true;
				campaigns[i].statusText = campaigns[i].status;
			}else if(campaigns[i].status == "Campaign Inprogress"){
				campaigns[i].color = "orange";
				campaigns[i].inProgress = true;
				campaigns[i].statusText = "In Progress";
			}
		}
	}
	OnSendCampaign(id){
		this.router.navigate(["dashboard/addcampaign"],{queryParams: { campId: id }}); //for the case 'the user logout I want him to be redirected to home.'
	}
	onCampaignResume(id){
				this.router.navigate(["dashboard/addcampaign"],{queryParams: { campId: id ,status: 'resume'}}); //for the case 'the user logout I want him to be redirected to home.'
	}
	onCampaignDelete(id,$event){
	var answer = window.confirm("Are you sure? want to delete Campaign");
		if(answer)
		{
			this.campaignObj.campaign_id = id;
			this.campaignObj.token = this.token;
			this.mycampaignService.campaignDelete(this.campaignObj)
			.subscribe(resp =>{
				if(resp.status){
					for(var i = 0; i < this.campaigns.length; i++){
						if(id == this.campaigns[i].campaign_id){
							this.campaigns.splice(i,1);
							this.alertsService.changeAlert({value: true});
							this.alertsService.changeAlertsMessage({type: 'success' , message: 'Campaign deleted successfully'})
							//show alert that campaign deleted
						}
					}
				}
				else{
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: 'We are facing some issues.Please comeback later.'})
				}
			})
		}
	}
	campaignSearch($event){
		let q = ($event.target.value).toLowerCase();
		if(q.length){
			this.isPageLoaded = false;
			this.mycampaignService.searchCampaign(this.token,q).subscribe(resp => {
				if(resp.status){
					this.isCampaignsEmpty = false;
					this.campaigns = resp.message.campaign_data;
					this.getDateAndColor(this.campaigns);
				}else{
					this.campaigns = [];
					this.isCampaignsEmpty = true;
				}
			})
		}
		else{
			this.isCampaignsEmpty = false;
			this.campaigns = this.allCampaigns;
			this.isPageLoaded = true;
		}
	}
	alertsClear(){
		this.alertsService.changeAlert({value: false});
	};
	createCampaign($event){
		this.authService.isAllowCreateCampaign(this.token)
  		.subscribe(resp => {
  			if(resp.status){
  				this.router.navigateByUrl('dashboard/addcampaign');
  			}else{
  				// show error mesage
  				this.alertsService.changeAlert({ value: true });
            	this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message });
  			}
  		})
  	}
  	onResendExistingCampaign(id: any){
  		this.mycampaignService.getResendingCampaignId(id, this.token)
  		.subscribe(resp => {
  			if(resp.status){
  				var new_id = resp.message.new_cpg_id;
  				this.router.navigate(['dashboard/addcampaign'], { queryParams: { campId: new_id} });
  			}else{
  				this.alertsService.changeAlert({ value: true });
            	this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message });
  			}
  		})
	  }
	  onViewCampaignClick($event,campaign){
		  this.router.navigate(['dashboard/campaign'],{queryParams:{id: campaign.campaign_id}});

	  }
	  onMouseOver($event,campaign){	  	
	  	if(campaign.inProgress){
	  		//send api call to show progress
	  		this.mycampaignService.getProgressCampaignStats(this.token,campaign.campaign_id)
	  		.subscribe(resp => {
	  			if(resp.status){
		  			campaign.isShowdiv = true;
		  			campaign.pendingSent = resp.message.sent;
		  			campaign.pendingTotal = resp.message.total_count; 
	  			}else{
	  				campaign.isShowdiv = false;
	  			}
	  		})
	  	}
	  }
	  onMouseLeave($event,campaign){
	  	if(campaign.inProgress){
	  		campaign.isShowdiv = false;
	  	}
	  }
	  onCampaignTypeChange($event, value: string){
	  	this.data.type = value;
	  	this.data.page_no = "1";
	  	this.isPageLoaded = false;
	  	this.isDataLoaded = false;
	  	this.isCampaignsEmpty = false;
	  	this.campaigns = [];
	  	//send api call to refresh the data.
	  	this.mycampaignService.getAllCampaignsData(this.data)
		.subscribe(response => {
			if(response.status){
				var resp = response;
				this.isDataLoaded = true;
				this.campaigns = resp.message.campaign_data;
				this.totalItems = (resp.message.total_page_count * 10);
				// (response.message.total_page_count * 10);
				this.allCampaigns = this.campaigns;
				this.getDateAndColor(this.campaigns);
				this.isPageLoaded = true;
				this.isDataLoaded = true;
			}
			else{
				this.isCampaignsEmpty = true;
				this.isDataLoaded = true;
			}
		})
	  }
}
