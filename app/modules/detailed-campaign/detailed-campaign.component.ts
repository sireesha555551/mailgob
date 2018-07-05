import { DetailedCampaignService } from './detailed-campaign.service';
import { DashboardService } from './../dashboard/dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../common.service';
import { AlertsService } from '../alerts/alerts.service';





declare var $: any;
declare global {
  interface Window { randomize: any; }
}

@Component({
  selector: 'app-detailed-campaign',
  templateUrl: './detailed-campaign.component.html',
  styleUrls: ['./detailed-campaign.component.scss'],


})
export class DetailedCampaignComponent implements OnInit {
  contactList = [];
  token: String = "";
  campaignId: any;
  CampaignData: any;
  latestCampaign: any;
  contact_list_id: any;
  contacts_stats_list: any;
  graph: any;
  info: any;
  bouncedPercent: any;
  deliveredPercent: any;
  unsubscribePercent: any;
  openedPercent: any;
  contacts_stats: number;
  campaign_stats: any = {
    total: 0
  };


  constructor(
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private commonService: CommonService,
    private alertsService: AlertsService,
    private detailedCampaignService: DetailedCampaignService
  ) { }

  ngOnInit() {

    this.token = this.cookieService.get('token');
    this.commonService.makeTawkHide();
    if (this.token) {
      this.commonService.getUserData();
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.campaignId = params['id'];
        console.log(this.campaignId);
        this.getAllStatsOfCampaign();

      })
    } else {
      //route to login
    }
  }
  graphLoading() {
    var self = this;
    window.randomize = function () {
      $('.unsubscribe-percent').attr('data-progress', self.unsubscribePercent);
      $('.bounced-percent').attr('data-progress', self.bouncedPercent);
      $('.opened-percent').attr('data-progress', self.openedPercent);
      $('.delivered-percent').attr('data-progress', self.deliveredPercent);
    }
    setTimeout(window.randomize);
    $('.unsubscribe-percent').click(window.randomize);
    $('.bounced-percent').click(window.randomize);
    $('.opened-percent').click(window.randomize);
    $('.delivered-percent').click(window.randomize);
  }
  getAllStatsOfCampaign() {
    // service call to get data of campaign
    this.dashboardService.getLatestCampaignData(this.campaignId).subscribe(resp => {
      if (resp.status) {
        this.campaign_stats = resp.message.campaign_stats;
        this.campaign_stats.total_bounced = this.campaign_stats.bounced.hard_bounce + this.campaign_stats.bounced.soft_bounce;
        this.deliveredPercent = ((this.campaign_stats.delivered / this.campaign_stats.total) * 100).toFixed(0);
        this.openedPercent = ((this.campaign_stats.opened / this.campaign_stats.total) * 100).toFixed(0);
        this.unsubscribePercent = ((this.campaign_stats.unsubscribe / this.campaign_stats.total) * 100).toFixed(0);
        this.info = resp.message.info;
        this.contacts_stats = Object.keys(resp.message.contacts_stats).length;
        this.contacts_stats_list = resp.message.contacts_stats;
        // object to array
        //this.arrayOfKeys = Object.keys(this.contacts_stats_list);
        // console.log(this.arrayOfKeys);
        for (let key in this.contacts_stats_list) {
          let contactList1 = [];
          let value = this.contacts_stats_list[key];
          contactList1['contactlist_name'] = key;
          contactList1['created_on'] = value.created_on;
          contactList1['contact_list_id'] = value.contact_list_id;
          contactList1['isShow'] = false;
          this.contactList.push(contactList1);
        }
        this.graphLoading();
      }
      else {
        this.alertsService.changeAlert({ value: true });
        this.alertsService.changeAlertsMessage({ type: 'error', message: "Please choose correct field" });
      }
    })
  }
  onContactListClick(event, key) {
    if (key.isShow) {
      key.isShow = false;
    }
    else {     
      this.detailedCampaignService.getContactListCampaignData(this.campaignId, key.contact_list_id).subscribe(resp => {
        for (var i = 0; i < this.contactList.length; i++) {
          if (this.contactList[i].contact_list_id == key.contact_list_id) {
            this.contactList[i].isShow = true;
          }
          else {
            this.contactList[i].isShow = false;
          }
        }
        if (resp.status) {
          var list = resp.message;
          key.totalEmail = list.total_count;
          key.efective_percentage = list.efective_percentage + '%';
          key.deliveredPercent = ((list.delivered_count / list.total_count
          ) * 100).toFixed(0);
          if (key.deliveredPercent === "NaN") {
            key.deliveredPercent = 0;
          }
          key.openedPercent = ((list.tracked_count / list.total_count
          ) * 100).toFixed(0);
          if (key.openedPercent === "NaN") {
            key.openedPercent = 0;
          }
          key.unsubscribePercent = ((list.unsubscribed_count
            / list.total_count
          ) * 100).toFixed(0);
          if (key.unsubscribePercent === "NaN") {
            key.unsubscribePercent = 0;
          }
          key.bouncedPercent = ((list.bounced_count / list.total_count
          ) * 100).toFixed(0);
          if (key.bouncedPercent === "NaN") {
            key.bouncedPercent = 0;
          }
        }
        else {
          key.isShow = false;
        }
      })
    }
  }
}