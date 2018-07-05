import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';


@Injectable()
export class AdminDashboardService{
    private url = environment.apiUrl;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
  	constructor(private http: Http) { }
  	getAdminUsersData(page_no){
  		return this.http.post(`${this.url}/adminpanel/alluserlist`,{page_no: page_no}, this.options)
		.map(response => response.json())
  	}
  	getUserCampaignsInfo(user_id, page_no){
  		return this.http.post(`${this.url}/adminpanel/userdemograph`, {user_id: user_id, page_no: page_no }, this.options)
  		.map(response => response.json())
  	}
}