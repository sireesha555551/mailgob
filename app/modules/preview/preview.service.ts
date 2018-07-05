import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';

@Injectable()
export class PreviewService{
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(		private http: Http) { }

  	shootMailsToCustomers(obj): Observable<any>{
  		return this.http.post(`${this.url}/campaign/save` ,obj, this.options)
  		.map(resp => resp.json())
 	}
 	sendTestEMail(email, token, template_id, campaign_id){
 		return this.http.post(`${this.url}/email/sendtestemail`, {token: token, email: email, template_id: template_id,campaign_id: campaign_id},this.options)
 		.map(resp => resp.json())

 	}
 	deleteAttachment(id,token,campaign_id){
 		return this.http.post(`${this.url}/campaign/attachmentdelete` , {token: token, attach_id: id, campaign_id: campaign_id}, this.options)
 		.map(resp => resp.json());
 	}
}