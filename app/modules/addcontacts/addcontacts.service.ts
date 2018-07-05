import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';


@Injectable()
export class AddContactsService{
  private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(private http: Http) { }
  	uploadContacts(data): Observable<any>{
		return this.http.post(`${this.url}/contacts/upload` ,data, this.options)
		.map(response =>  response.json())	
  	}

  	getAllContacts(data){
  		return this.http.post(`${this.url}/contacts/activelist`, data, this.options)
  		.map(response => response.json())
  	}
    deleteContactList(data){
      return this.http.post(`${this.url}/contacts/contactDeleteStatus`,data,this.options)
      .map(response => response.json())
    }
    searchContact(token,param){
      return this.http.post(`${this.url}/contacts/searchcontact` , {token: token, character: param})
      .map(response => response.json())
    }
    downloadCsv(token, type,contact_list_id){
      return this.http.post(`${this.url}/contacts/contactcsv`, {token: token, type: type, contact_list_id: contact_list_id })
      // .map(response => response)
    }
}