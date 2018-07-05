import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from './admin-dashboard.service';
import {Router} from '@angular/router';
import {CommonService} from '../common.service';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
	totalItems: any = 0;
	usersList: any;
	page_no: any = 1;
	page: any;
	isPageLoaded: boolean = false;
	constructor(
		private adminDashboardService: AdminDashboardService,
		private router:Router,
		private commonService: CommonService) { }

	ngOnInit() {
		this.getAdminUsersData();
		this.commonService.makeTawkHide();
	}
	getAdminUsersData(){
		this.adminDashboardService.getAdminUsersData(this.page_no)
		.subscribe(resp => {
			if(resp.status){
				this.isPageLoaded = true;
				this.usersList = resp.message.users;
				this.totalItems = resp.message.total_count;
			}else{
				this.isPageLoaded = false;
			}
		})
	}
	public getServerData(event){
		this.page_no = event;
		this.adminDashboardService.getAdminUsersData(this.page_no).subscribe(
			response =>{
				if(response.status) { 
					this.usersList = [];
					this.usersList = response.message.users;
				} else {
					alert('Max page number limit Executed');
				}
			},
			error =>{
				alert('Server error');
			}
			);
		return event;
	}
	onViewClick(user){
	 	this.router.navigate(['perform/admin/userstatistics'],{queryParams:{id: user.id}});
	}

}
