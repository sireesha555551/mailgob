import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';


@Injectable()
export class LoginService{
  private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token: any;
  	constructor(		private http: Http) { }
  	
    // getCampaignData(data){
    //   return this.http.post(`${this.url}/campaign/draft`, data,this.options)
    //   .map(response => response.json())
    // }
    userLoginCheck(data: any): Observable<any>{
      return this.http.post(`${this.url}/api/login`, data, this.options)
      .map(resp => resp.json());
    }

    getCountries(){
      return this.http.get(`${this.url}/userprofile/getcountry`, this.options)
      .map(resp => resp.json());
    }

    userRegisterCheck(data: any): Observable<any>{
      return this.http.post(`${this.url}/api/register`, data, this.options)
      .map(resp => resp.json());
    }
    sendForgotPasswordMail(email: any){
      return this.http.post(`${this.url}/user/resetpassword`, {email: email}, this.options)
      .map(resp => resp.json());
    }
}