import { Component, OnInit,ViewChild ,AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm,FormControl} from '@angular/forms';
import {MyCampaignService} from '../mycampaign/mycampaign.service';
import * as moment from 'moment'; // add this 1 of 4
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {CommonService} from '../common.service';
import { MatStepper } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import {EditorService} from '../editor.service';
import {AuthService} from '../auth.service';
import {AlertsService} from '../alerts/alerts.service'
import { HostListener,ElementRef,Renderer } from '@angular/core'




@Component({
	selector: 'app-addcampaign',
	templateUrl: './addcampaign.component.html',
	styleUrls: ['./addcampaign.component.scss']
})
export class AddcampaignComponent implements OnInit, AfterViewInit {
	isLinear = true;
	createCampaignFormGroup: FormGroup;
	addContactsFormGroup: FormGroup;
	newsLetterFormGroup: FormGroup;
	formGroup: FormGroup;
	token: any;
	@ViewChild('stepper') private myStepper: MatStepper;
	totalStepsCount: number;
	campaign_id: number;
	data = {
		token: "",
		campaign_id: ""
	}
	campData: any;
	contactData: any = [];
	templateData: any;
	step1Completed: boolean = false;
	step2Completed:boolean = false;
	step3Completed: boolean = false;
	step4Completed: boolean =  false;
	isInside: boolean = false;

	private url = `http://api.mailgob.com`;	
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	constructor(private _formBuilder: FormBuilder,
		private myCampaignService: MyCampaignService,
		private http: Http,
		private router: Router,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private cookieService: CookieService,
		private editorService: EditorService,
		private authService: AuthService,
		private alertsService: AlertsService,
		private el: ElementRef,
        private renderer: Renderer
		){ }


	stepper: any;
	  
	private applyFormValues (group, formValues) {
		Object.keys(formValues).forEach(key => {
			let formControl = <FormControl>group.controls[key];
			if (formControl instanceof FormGroup) {
				this.applyFormValues(formControl, formValues[key]);
			} else {
				formControl.setValue(formValues[key]);
			}
		});
	}
	ngOnInit() {
		this.alertsClear();
		if(this.cookieService.get('token')){
			this.getUserData();
				this.createCampaignFormGroup = this._formBuilder.group({
					campaign_name: ['', Validators.required],
					subject: ['', Validators.required],
					from_email: [localStorage.email, Validators.required],
					from_name: [localStorage.name, Validators.required],
					reply_to: [localStorage.email, Validators.required]
				});
				this.formGroup = this._formBuilder.group({})
				this.makeGlobalEmpty();
		        this.commonService.makeTawkHide();
		}else{
			this.router.navigate(['/login']);
		}
	}
	ngAfterViewInit() {
		this.totalStepsCount = this.myStepper._steps.length;
	}
	getUserData(){
		this.commonService.getUserData();
		this.token = this.cookieService.get('token');
		if(this.token){
			this.getCampaignData()
		}
	}
	getCampaignData(){
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.data.token  = this.token;
			this.data.campaign_id = params['campId'];
			this.campaign_id = parseInt(this.data.campaign_id);
			var campaign_status = params['status'];
			if(this.data.campaign_id){
				this.myCampaignService.getCampaignData(this.data)
				.subscribe(resp => {
					if(resp.status){
						this.campData = resp.message.campaigndata;
						this.templateData = resp.message.template;
						var attachments = resp.message.attachment;
						var contactsObj = {
						}
						for(let key in resp.message.contactsdata){
							let value = resp.message.contactsdata[key];
							contactsObj["contact_list_id"] = key;
							contactsObj["list_name"] = value;
							if(value != ""){
								this.contactData.push(contactsObj);
							}
							contactsObj = {};
						}
						if(this.campData){
							this.applyFormValues(this.createCampaignFormGroup, this.campData);
							this.stepper = this.myStepper;
							this.campData.campaign_id = this.campaign_id;	
							this.commonService.changeMessage(this.campData);
							if(this.templateData.tmpl_id){
								this.campData.attachments = attachments;
								this.commonService.changeContact(this.contactData);
								this.commonService.changeHtml(this.templateData.templatedata)
								this.templateData.template_id = this.templateData.tmpl_id;
								this.commonService.changeTemplate(this.templateData);
								this.editorService.changeTemplate(this.templateData.type);
								this.commonService.changeAttachment(attachments);
								this.isLinear = false;
								this.myStepper.linear = false;
								this.stepper.selected.completed = true;
								this.stepper.next();
								this.stepper.selected.completed = true;
								this.stepper.next();
								this.stepper.selected.completed = true;
								this.myStepper.selectedIndex = 3;
								this.templateData.tmpl_type = this.templateData.type;
							}else{
								this.commonService.changeContact(this.contactData);
								this.templateData.template_id = this.templateData.tmpl_id;
								this.commonService.changeTemplate(this.templateData);
								this.editorService.changeTemplate(this.templateData.type);
								this.commonService.changeHtml('');
								this.myStepper.linear = false;
								this.stepper.selected.completed = true;
								this.stepper.next();
								this.stepper.selected.completed = true;
								this.myStepper.linear = true;
							}
						}							
					}
					else{
						console.log("No Data");
					}
				})
			}
			else{
			   this.isAllowToCreate()
			}
		})
	}
	onCampaignCreate(campaignCreateForm: NgForm,stepper: MatStepper){
		let data = campaignCreateForm.value;
		var dateTime = new Date();
		data.start_date = moment(dateTime).format("YYYY-MM-DD"); 
		data.token = this.token;
		this.stepper = stepper;
		//update call  for campaign
		if(this.campaign_id > 0){
			data.campaign_id = this.campaign_id;
			this.myCampaignService.postCampaignData(data)
			.subscribe(response => {
				var resp = response;
				if(resp.status){
					this.isLinear = false;
					this.stepper.linear = false;
					this.commonService.campaignData = data;
					this.commonService.changeMessage(data);
					stepper.next();
					this.isLinear = true;
					this.stepper.linear = true;
				}else{
					console.log("Data Missing")
				}
			})
		}else{
			this.step1Completed = true;
			this.myCampaignService.postCampaignData(data)
			.subscribe(response => {
				var resp = response;
				if(resp.status){
					this.stepper.linear = false;
					data.campaign_id = resp.campaign_id;
					this.campaign_id = resp.campaign_id
					this.commonService.campaignData = data;
					this.commonService.changeMessage(data);
			 		this.stepper.selected.completed = true;
			 		stepper.next();
					this.stepper.linear = true;
				}else{
					console.log("Data Missing")
				}
			})
		}
	}
	message:string;
	stepperChange($event) {
		this.message = $event;
		this.stepper.linear = true;
		if(this.message == "next"){
			this.stepper.linear = false;
			this.stepper.selected.completed = true;
			this.stepper.next();
		}else if(this.message == "back"){
			this.stepper.previous();
		}else if(this.message == "campaign"){
			//from preview to add campaign
			this.stepper.linear = false;
			this.stepper.selectedIndex = 0;
		}
		else{
			alert("Something went Wrong");
		}
	}
	makeGlobalEmpty(){
	    this.commonService.changeHtml('');
	    this.commonService.changeMessage('');
	    this.commonService.changeContact('');
	    this.commonService.changeTemplate('');
	    this.editorService.changeTemplate('')
	}
	alertsClear(){
		this.alertsService.changeAlert({value: false});
	};
	isAllowToCreate(){
		this.authService.isAllowCreateCampaign(this.token)
  		.subscribe(resp => {
  			if(resp.status){
  				//do nothing it will be in the same page
  			}else{
  				// show error message
  				this.alertsService.changeAlert({ value: true });
          this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message });
  				this.router.navigate(['dashboard/dashboardhome']);
  			}
  		})
	}
}
