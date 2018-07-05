import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';


@Injectable()
export class DashboardService{
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(		private http: Http) { }

  	//to get weekly data
	getWeeklyData(tokenData){
	  	return this.http.post(`${this.url}/dashboard/graphData`, {token: tokenData, delimiter: "weeks"}, this.options)
		.map(response =>  response.json())
	}

	//to get monthly data
	getMonthlyData(tokenData) {
		return this.http.post(`${this.url}/dashboard/graphData`, {token: tokenData, delimiter: "months"}, this.options)
		.map(response =>  response.json())
	}

	getDaydata(tokenData): Observable<any>{
		return this.http.post(`${this.url}/dashboard/graphData`, {token: tokenData, delimiter: "day"}, this.options)
		.map(response =>  response.json())
	}

	getAllStats(tokenData): Observable<any>{
		return this.http.post(`${this.url}/dashboard/dashboardrightpane`, {token: tokenData} , this.options)
		.map(response => response.json())
	}
	getAllCampaingsData(token): Observable<any>{
		return this.http.post(`${this.url}/analytics/getanalyticdata`, {token: token}, this.options)
		.map(response => response.json())
	}
	getLatestCampaignData(campaign_id): Observable<any>{
		return this.http.post(`${this.url}/analytics/campaignstatsid` , {campaign_id: campaign_id}, this.options)
		.map(response => response.json())
	}
}