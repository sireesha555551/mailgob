import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';

@Injectable()
export class DetailedCampaignService{
	private url = environment.apiUrl;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
  	constructor(private http: Http) { }
  	getContactListCampaignData(campaign_id,contact_list_id): Observable<any>{
		return this.http.post(`${this.url}/analytics/campaignstatscontactid` , {campaign_id: campaign_id, contact_list_id:contact_list_id}, this.options)
		.map(response => response.json())
	}

  }