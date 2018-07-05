import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AuthService} from '../auth.service'





@Injectable()
export class AlertsService{
	private alertsSource = new BehaviorSubject<object>({});
	private alertsMessages = new BehaviorSubject<object>({});
	currentMessage = this.alertsSource.asObservable();
	currentAlert = this.alertsMessages.asObservable();
	constructor(private http: Http,
		private authService: AuthService) { }
	//is alert check 
	changeAlert(isAlert: any) {
		this.alertsSource.next(isAlert)
	}
  	//alert messages data
  	changeAlertsMessage(alert: any){
  		this.alertsMessages.next(alert);
  	}
  }

