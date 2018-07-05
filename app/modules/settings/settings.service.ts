import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { SIGKILL, SSL_OP_SINGLE_DH_USE } from 'constants';
import {environment} from '../../../environments/environment';


@Injectable()

export class SettingsService {
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	constructor(private http: Http) { }
	postSettingsData(data): Observable<any> {
		return this.http.post(`${this.url}/userprofile/basicinfo`, { token: data }, this.options)
			.map(response => response.json())
	}
	getAllProfileData(data) {
		return this.http.post(`${this.url}/userprofile/updateadd`, data, this.options)
			.map(response => response.json())
	}
	settingsCountry(tokenNum){
		return this.http.post(`${this.url}/userprofile/getcountry`, {token: tokenNum},this.options)
		.map(resp => resp.json())
	  }
	  getStates(data){
		  return this.http.post(`${this.url}/userprofile/getstates`,{cid: data}, this.options)
		  .map(resp => resp.json())
	  }
	  getCurrentPassword(data){
		  return this.http.post(`${this.url}/user/check`,data,this.options)
		  .map(response=>response.json())
	  }
	  postNewPassword(data,token){
		  var obj=data;
		  obj.token=token;
		return this.http.post(`${this.url}/user/changepass`,obj,this.options)
		.map(response => response.json())
	  }
	
	}

	
