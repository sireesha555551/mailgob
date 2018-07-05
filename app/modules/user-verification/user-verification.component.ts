import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthService} from '../auth.service';
import {AlertsService} from '../alerts/alerts.service';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {
	isLog: boolean = false;
	message = "Email sent to your inbox Please click on the verification link to get it activated and get started!";
  	email : any;
  constructor(
  	private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  	this.activatedRoute.queryParams.subscribe((params: Params) => {
  		if(params['isLog'] == "true"){
  			this.isLog = true; 
  			this.message = "Failed to login account is not activated !!!";
  		}else{
  			this.isLog = false;
  			this.message = "Email sent to your inbox. Please click on the verification link to get it activated and get started!";
      }
  		this.email = params['email'];
  	})
  }
  onResendVerifyEmail($event){
    this.authService.resendVerifyLink(this.email)
    .subscribe(resp => {
      if(resp.status){
        this.alertsService.changeAlert({ value: true });
        this.alertsService.changeAlertsMessage({ type: 'success', message: "Verification link sent successfully.Please check your email.", time: 4000 });
        setTimeout(()=>{    //<<<---    using ()=> syntax
            this.router.navigate(['login'], { queryParams: { val: 'log'} });
        },5000);
      }else{
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({ type: 'error', message: "Please check the email once.", time: 4000 })
      }
    })
  }
  onBackClick($event){
    this.router.navigate(['login'], { queryParams: { val: 'log'} });
  }

}
