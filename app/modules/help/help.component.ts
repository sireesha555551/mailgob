import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, NgForm,FormControl} from '@angular/forms';
import {CommonService} from '../common.service';
import {AlertsService} from '../alerts/alerts.service';
// import Tawk_API from '';
declare var $: any;
declare var Tawk_API : any;
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  panelOpenState: boolean = false;
  token: any;
  sendEmailFormGroup: FormGroup;
  formGroup: FormGroup;
  constructor(
  	private cookieService: CookieService,
  	private router: Router,
  	private _formBuilder: FormBuilder,
  	private commonService:CommonService,
  	private alertsService: AlertsService) { }

  ngOnInit() {
  	if(this.cookieService.get('token')){
  		this.token = this.cookieService.get('token');
  		this.sendEmailFormGroup = this._formBuilder.group({
  			subject: ['', Validators.required],
  			message: ['', Validators.required],
  		});
		  this.formGroup = this._formBuilder.group({});
      this.commonService.makeTawkHide();
  	}else{
		this.router.navigate(['/login']);
  	}
  }
  onSubmit(sendEmailForm: NgForm){
  	var data = sendEmailForm.value;
  	data.token = this.token;
  	data.email = localStorage.getItem('email');
  	if(sendEmailForm.valid && this.token && data.email){
  		this.commonService.sendHelpData(data)
  		.subscribe(resp => {
  			if(resp.status){
  				this.alertsService.changeAlert({value: true});
  				this.alertsService.changeAlertsMessage({type: 'success' , message: resp.message});
  				this.sendEmailFormGroup.reset();
  				sendEmailForm.resetForm();
  			}else{
  				this.alertsService.changeAlert({value: true});
  				this.alertsService.changeAlertsMessage({type: 'error' , message: resp.message});
  			}
  		})
  	}else{
  		this.alertsService.changeAlert({value: true});
  		this.alertsService.changeAlertsMessage({type: 'error' , message: "Please enter subject/message"});
  	}
  }
  onChatClick($event){
    Tawk_API = Tawk_API || {};
    Tawk_API.showWidget();
    Tawk_API.maximize();

  }
  onOtherClick($event){
    Tawk_API = Tawk_API || {};
    
    Tawk_API.minimize();
    Tawk_API.hideWidget();
  }
}
