import { Component, OnInit } from '@angular/core';
import {AlertsService} from './alerts.service'

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
	success_alerts: any = [];
	error_alerts: any =[];
	isAlert:any;
	alerts:any;
	isError: boolean = true;
  display = 'none'; 
  time:any = 3000;

  constructor(
  	private alertsService: AlertsService) { }

  ngOnInit() {
  	this.alertsService.currentMessage.subscribe(resp =>{ this.isAlert = resp;
  	});
  	this.alertsService.currentAlert.subscribe(resp =>{
		  this.alerts = resp;
		  this.success_alerts = [];
		  this.error_alerts = [];
      this.display = 'block'
      if(this.alerts.time){
        this.time = this.alerts.time
      }
  		if(this.alerts.type == "error"){
  			this.isError = true;
  			this.error_alerts.push(this.alerts);
  			setTimeout(()=>{    //<<<---    using ()=> syntax
      			this.error_alerts = [];
            this.display = 'none';
 			  },this.time);
  		}else if(this.alerts.type == "success"){
  			this.isError = false;
  			this.success_alerts.push(this.alerts);
  			setTimeout(()=>{    //<<<---    using ()=> syntax
      			this.success_alerts = [];
            this.display = 'none';
 			  },this.time);
  		}
  	})
  }

}
