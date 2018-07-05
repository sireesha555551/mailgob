import { Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import * as moment from 'moment'; // add this 1 of 4
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
declare var Tawk_API : any;

@Injectable()
export class CommonService{
	private url = environment.apiUrl;
	// private url = `https://api.mailgob.com`;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	private token = {token: "udfk,c ;/z c;"};
	private messageSource = new BehaviorSubject<object>({});
	private contactSource = new BehaviorSubject<object>({});
	private templateSource = new BehaviorSubject<object>({});
	private htmlSource = new BehaviorSubject<object>({});
	private attachmentSource = new BehaviorSubject<object>({});
	private userSource = new BehaviorSubject<string>('noUser');
	currentMessage = this.messageSource.asObservable();
	currentContact = this.contactSource.asObservable();
	currentTemplate = this.templateSource.asObservable();
	currentAttachment = this.attachmentSource.asObservable();
	currentUser = this.userSource.asObservable();
	html = this.htmlSource.asObservable();
	campaignData: any;
	contactList: any;
	templateData: any;
	isUser: boolean = false;
	userData: any;
	localStorageData: any={
		email: "",
		password: ""
	}
	isActive: boolean = false;
	constructor(private http: Http,
		private cookieService: CookieService,
		private router: Router,
		private authService: AuthService) { }


	userParams = {
		status: true,
		data: {
			token: this.token
		},
		isUser: true
	}
	// getting userdata
	getUserData(){
		window.scrollTo(0, 0);
		// this.getInformationFromStorage()
		if(this.isUser){
			this.isActive = true;
			var time = new Date(localStorage.getItem('time'));
			var current = new Date();
			var duration = moment.duration(moment(current,"DD/MM/YYYY HH:mm:ss").diff(time));
			var hours = duration.asMinutes();
			if((hours < 60) && (hours > 45)){
				this.localStorageData.email = localStorage.getItem('email');
				this.localStorageData.password = localStorage.getItem('password');
				this.http.post(`${this.url}/api/login` ,this.localStorageData, this.options)
				.subscribe(resp => {
					var data = resp.json()
					if(data.status){
						this.cookieService.delete('token');
						// localStorage.set('time', new Date());
						this.changeUser('user');
						this.cookieService.set('token', data.data.token);
						localStorage.setItem('time', new Date().toString());
						return data.data.token;
					}
					else{
						this.removeAllUserData();
					}
				})
			}else if(hours < 45){
				this.isUser = true;
				this.changeUser('user');
				return this.cookieService.get('token');
			}else{
				this.isUser =false;
				this.removeAllUserData();
			}	
		}else if(this.cookieService.get('token') && !this.isUser){
			var time = new Date(localStorage.getItem('time'));
			var current = new Date();
			var duration = moment.duration(moment(current,"DD/MM/YYYY HH:mm:ss").diff(time));
			var hours = duration.asMinutes();
			if(hours < 40){
				if(localStorage.getItem('email')){
					this.localStorageData.email = localStorage.getItem('email');
					this.localStorageData.password = localStorage.getItem('password');
					this.http.post(`${this.url}/api/login` ,this.localStorageData, this.options)
					.subscribe(resp => {
						var data = resp.json()
						this.cookieService.delete('token','/dashboard');
						this.cookieService.delete('token','/');
						this.cookieService.delete('token');
						if(data.status){
							this.isUser = true;
							localStorage.setItem('time', new Date().toString());
							this.changeUser('user');
							// return data.data.token;
							this.cookieService.set('token', data.data.token );
							this.authService.getUserBasicInformation(data.data.token);
						}
					})
				}else{
					this.removeAllUserData();					
				}
			}else{
				this.removeAllUserData();
			}
		}else{
			this.removeAllUserData();
		}
	}
	//campaign data
	changeMessage(message: any) {
		this.messageSource.next(message)
	}
  	//contact data
  	changeContact(contact: any){
  		this.contactSource.next(contact);
  	}
  	//template Data
  	changeTemplate(template: any){
  		this.templateSource.next(template);
  	}
  	changeHtml(html: any){
  		this.htmlSource.next(html);
  	}
  	changeUser(user: string){
  		this.userSource.next(user);
  	}
  	changeAttachment(attachment: any){
  		this.attachmentSource.next(attachment);
  	}
  	setUserData(logindata){
  		this.isUser = true;
  		this.userData= logindata;
  		this.cookieService.set( 'token',logindata.token );
  		localStorage.setItem('email', logindata.email);
  		localStorage.setItem('password', logindata.password);
  		localStorage.setItem('time', logindata.time);   //syntax example
  		localStorage.setItem('name', logindata.userinfo.first_name);
  		this.authService.getUserBasicInformation(logindata.token);

  	}
  	userLogout(token: any){
  		this.http.post(`${this.url}/api/logout`,{token: token},this.options).
  		subscribe(resp => {
  			var response = resp;
  			this.cookieService.delete('token','/dashboard');
			this.cookieService.delete('token','/');
			this.cookieService.delete('token');
  			if(response.status){
  				//loggingout
  				// this.cookieService.deleteAll();
  				this.changeUser('nouser');
  				// setTimeout(()=>{
  					this.isUser = false;
  					this.router.navigate(['login'], { queryParams: { val: 'log'} });
  				// },2000);
  			}
  		})
  	}
	  removeAllUserData(){
			// this.cookieService.deleteAll();
	    // this.cookieService.delete('token');
	    this.cookieService.delete('token','/dashboard');
		this.cookieService.delete('token','/');
		this.cookieService.delete('token');
	    localStorage.clear();
	  	this.isUser = false;
	  	this.changeUser('nouser');
	  	alert('Please login Again');
		setTimeout(()=>{
			this.router.navigate(['login']);
		},2000);
	  }
	  doUnsubscribe(obj: any){
	  	return this.http.post(`${this.url}/tracker/unsubscribe`,obj,this.options)
	  	.map(resp => resp.json())
	  	// http://api.mailgob.com/tracker/unsubscribe?
	  }

	  sendHelpData(data){
	  	return this.http.post(`${this.url}/mailgob/emailchat`,data,this.options)
	  	.map(resp => resp.json());
	  }
	  makeTawkHide(){
	  	setTimeout(()=>{
	  		Tawk_API.minimize();
    		Tawk_API.hideWidget();
    	},2000);
	  }
	  makeUserLogout(){
	  	this.cookieService.delete('token','/dashboard');
		this.cookieService.delete('token','/');
		this.cookieService.delete('token');
	  	this.isUser = false;
	  	this.changeUser('nouser');
	    localStorage.clear();
	  }

  }

