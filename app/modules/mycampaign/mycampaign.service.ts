import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';

@Injectable()
export class MyCampaignService{
  private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(		private http: Http) { }
  	postCampaignData(data): Observable<any>{
  		console.log("service Data");
		return this.http.post(`${this.url}/campaign/create` ,data, this.options)
		.map(response =>  response.json())	
  	}
  	getAllCampaignsData(data){
  		return this.http.post(`${this.url}/dashboard/listcampaigns` , data, this.options)
  		.map(response => response.json())
  	}
    getCampaignData(data){
      return this.http.post(`${this.url}/campaign/draft`, data,this.options)
      .map(response => response.json())
      .catch((error:any) => Observable.throw(error.json().error) || 'Server Error');
    }
    campaignDelete(data){
      return this.http.post(`${this.url}/campaign/campaigndelete`, data,this.options)
      .map(resp => resp.json())
    }
    searchCampaign(token,param){
      return this.http.post(`${this.url}/dashboard/campaignsearch`, {token: token, character: param}, this.options)
      .map(resp => resp.json())
    }
    getResendingCampaignId(id,token){
      return this.http.post(`${this.url}/campaign/resendcampaign`, {token: token, campaign_id: id}, this.options)
      .map(response => response.json());
    }
    getProgressCampaignStats(token,campaign_id){
      return this.http.post(`${this.url}/campaign/progresscount`, {token: token, campaign_id: campaign_id},this.options)
      .map(response => response.json());
    }
}