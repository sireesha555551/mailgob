import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {AuthService} from '../auth.service';
import {AlertsService} from '../alerts/alerts.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
	selector: 'app-resetpassword',
	templateUrl: './resetpassword.component.html',
	styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
	id: any;
	isTokenVerified: boolean = true;
	password: any;
	confirmPassword: any;
	constructor(private router: Router,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private alertsService: AlertsService,
		private cookieService:CookieService
		) { }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.id = params['id'];
			this.authService.verifyTokenForReset(this.id)
			.subscribe(resp => {
				this.cookieService.delete('token','/dashboard');
				this.cookieService.delete('token','/');
				if(resp.status){
					this.isTokenVerified = true;
				}else{
					this.isTokenVerified = false;
				}
			})

		})
	}
	onResetPasswordClick($event){
		if(this.confirmPassword && this.password){
			if(this.password == this.confirmPassword){
				this.authService.submitResetPassword(this.password,this.confirmPassword,this.id)
				.subscribe(resp => {
					if(resp.status){
	  				//redirect to login
	  				this.alertsService.changeAlert({value: true});
	  				this.alertsService.changeAlertsMessage({type: 'success' , message: "password reset successfully.."})
	  				this.router.navigate(["login"]);
	  			}else{
	  				this.alertsService.changeAlert({value: true});
	  				this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong.."})
	  			}
	  		})
			}else{
	  		//please check password
	  		this.alertsService.changeAlert({value: true});
	  		this.alertsService.changeAlertsMessage({type: 'error' , message: "Current password not matching with Confirm password"})
	  	}
	  }else{
	  	this.alertsService.changeAlert({value: true});
	  	this.alertsService.changeAlertsMessage({type: 'error' , message: "password can't be blank"})
	  }

	}
	loginClick($event){
		this.router.navigate(["login"]);
	}


}
