import { router } from './../app.router';
// for user login and logout  and session info
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import {Router,ActivatedRoute} from '@angular/router';
import * as moment from 'moment'; 
import {environment} from '../../environments/environment';
import {CanActivate} from "@angular/router";


@Injectable()
export class AuthService implements CanActivate {
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	userBasicInfo: any;
	token: any;
	paramsInfo: any;
	private currentUserInfoSource = new BehaviorSubject<object>({});
	private currentParams = new BehaviorSubject<string>('none');
	currentUserInformation = this.currentUserInfoSource.asObservable();
	currentParamInfo = this.currentParams.asObservable();

	constructor(
		private http: Http,
		private router:Router,
		private cookieService:CookieService,
		private activatedRoute: ActivatedRoute
	){

	}
	canActivate() {
		this.currentParams.subscribe(params => {this.paramsInfo = params});
		this.token = this.cookieService.get('token');
		if(this.token){
			var url = this.router.url.split('?')[0];
			if(url == "/dashboard/addcampaign"){
				if(this.paramsInfo == "save" ){
					this.changeCurrentParam('none');
					return true;
				}else{
					var answer = window.confirm("All unsaved changes will be discarded.Are you sure want to Leave?");
			  		if(answer){
			  			return true;
			  		}else{
						return false;
			  		}
				}
			}else{
		    	return true;			
			}
		}else{
			this.router.navigate(['/login']);
		}
  	}
	getUserBasicInformation(token){
  		this.http.post(`${this.url}/userprofile/basicinfo`,{token: token},this.options)
  		.subscribe(resp => { var data = resp.json();
  			this.userBasicInfo = data;
  			localStorage.setItem('name', data.message.first_name);
  			this.changeCurrentUser(data.message)
  		})
	}
	changeCurrentUser(data: any){
  		this.currentUserInfoSource.next(data)
  	}
  	changeCurrentParam(data: string){
  		this.currentParams.next(data);
  	}

	//while reset password
	verifyTokenForReset(token){
		return this.http.post(`${this.url}/user/verifytoken`, {reset_token: token}, this.options)
		.map(resp => resp.json());
	}

	submitResetPassword(password,confirmpassword, token){
		return this.http.post(`${this.url}/user/updatepassword`, {id: token, new_password: password,confirm_password: confirmpassword}, this.options)
	}

	afterResetLogout(){
		setTimeout(()=>{
			this.router.navigate(['login']);
		},3000)			
	}
	resendVerifyLink(email){
		return this.http.post(`${this.url}/sysemails/resendverify`, {email: email}, this.options)
		.map(resp => resp.json());
	}
	isAllowCreateCampaign(token){
		return this.http.post(`${this.url}/dashboard/checkCampaign` , {token: token}, this.options)
		.map(resp => resp.json());
	}
	verifyEmailFromEmailExist(email){
		return this.http.post(`${this.url}/user/checkemail`, {email: email},this.options) 
		.map(resp => resp.json());
	}
}