import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {AuthService} from '../auth.service';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isUser: boolean = false;
	user = {
		email: "",
		name: ""
	}
	userDetails: any;
	constructor(
		private router: Router,
		private commonService:CommonService,
		private cookieService: CookieService,
		private authService: AuthService
		) { }

	ngOnInit() {
		this.commonService.currentUser.subscribe(resp => {
			var isUser = resp;
			if(isUser == "user"){
				this.isUser = true;
			}else{
				this.isUser = false;
			}
			if(this.cookieService.get('token')){
				this.isUser = true;
				this.authService.currentUserInformation.subscribe(message => {
					this.userDetails = message;
				});
				this.user.email = localStorage.getItem('email');
				this.user.name = localStorage.getItem('name');
			}
		})
	}
	onLogoutClick($event){
		var token = this.cookieService.get('token');
		this.cookieService.delete('token');
		localStorage.clear();
		this.commonService.userLogout(token);
	}
	onLogoClick($event){
		var route = this.router.url;
		route = route.split('?')[0];
		if(route === '/login'){
			window.location.href = 'https://www.beta.mailgob.com/';
		}else{
			this.router.navigate(["dashboard/dashboardhome"]);
		}
	}
	onProfileClick($event){
		this.router.navigate(["dashboard/settings"]);
	}
	onHelpClick($event){
		this.router.navigate(["dashboard/help"]);
	}
}
