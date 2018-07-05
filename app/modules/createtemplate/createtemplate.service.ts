import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';

@Injectable()
export class CreateTemplateService{
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(		private http: Http) { }

  	sendCampaignMails(obj): Observable<any>{
  		return this.http.post(`${this.url}/email/savetemplate` ,obj, this.options)
  		.map(resp => resp.json())
 	}
}