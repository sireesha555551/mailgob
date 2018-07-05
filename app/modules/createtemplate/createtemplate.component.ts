import { Component, OnInit,ViewChild, AfterViewInit,Output,EventEmitter } from '@angular/core';
import {CreateTemplateService} from './createtemplate.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {GrapeBuilderComponent} from '../grape-builder/grape-builder.component';
declare var grapesjs: any;
import {CommonService} from '../common.service';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {EditorService} from '../editor.service';
import {PreviewService} from '../preview/preview.service';
import {AlertsService} from '../alerts/alerts.service';


export interface template {
	tmpl_value: any,
	token: string,
	subject: any,
	tmpl_name: any
}

@Component({
	selector: 'app-createtemplate',
	templateUrl: './create-template.component.html',
	styleUrls: ['./create-template.component.scss']
})

export class CreatetemplateComponent implements OnInit {
	error_mesages: any=[];
	tmpl_value: any;
	token: any;
	private obj ={
		token: "",
		tmpl_name: "",
		tmpl_value: "",
		subject:"",
		template_id:"",
		tmpl_type: ""
	}
	template_id: any;
	html: any;
	campaignData: any;
	contactData: any;
	templateData: any;
	tmpl_type: any;
	commnadCheck: boolean = false;
	@Output() stepperEvent = new EventEmitter<string>();

	@ViewChild(GrapeBuilderComponent) gbc;

	private url = `http://api.mailgob.com`;	
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private options = new RequestOptions({ headers: this.headers });
	template: any;
	private mailObject = {
		token: "",
		campaign_id: "",
		template_id: "",
		contact_list: "",
    action: ""
	}


	constructor(private createTemplateService: CreateTemplateService,
		private http: Http,
		private commonService: CommonService,
		private cookieService: CookieService,
		private router: Router,
		private editorService: EditorService,
		private previewService: PreviewService,
		private alertsService: AlertsService) {
	}

	ngOnInit() {
		this.alertsClear();
		if(this.cookieService.get('token')){
			this.getUserData();
			this.html = this.gbc.message;
			this.editorService.editortype.subscribe(message => {
				this.tmpl_type = message;
			})
			this.commonService.currentMessage.subscribe(message => this.campaignData = message);
			var iframe   = document.getElementsByClassName('gjs-frame');
    	this.commonService.currentContact.subscribe(contactData => {
    	this.contactData = contactData});
		}else{
			this.router.navigate(['/login']);
		}
	}
	getUserData(){
		this.token  = this.cookieService.get('token');
		if(this.token){
			this.commonService.html.subscribe(message => {this.template = message});
			this.commonService.currentTemplate.subscribe(message => {
				this.templateData = message;
				this.template_id = this.templateData.template_id;
				// this.template = this.templateData.templatedata;
				this.commonService.changeHtml(this.template);
				this.html = this.gbc.message;
				// now manipulate the grapejs Html
			});
		}else{
			this.router.navigate(['/login']);			
		}
	}
	sendAsEvent($event){
		var htmlData: any;
		if(this.template_id){
			if(this.commnadCheck){
				htmlData = this.html.editors[this.html.editors.length -1].runCommand('gjs-get-inlined-html');
			}else{
				htmlData = this.html.editors[0].runCommand('gjs-get-inlined-html');
				this.commnadCheck = true;		
			}
			htmlData = htmlData.split('</body>')[0];
		}else{
			htmlData = this.html.editors[0].runCommand('gjs-get-inlined-html');
			this.commnadCheck = true;
		}
		if(htmlData.length){
			this.obj.tmpl_value = '<!doctype html><html lang="en"><head><style>' + 
			'</style></head><body>' + 
			htmlData;
			this.obj.token = this.token;
			this.obj.tmpl_name = "Demotest";
			this.obj.tmpl_type = this.tmpl_type;
			this.obj.subject = this.campaignData.subject;
			if(this.template_id){
				this.obj.template_id  = this.template_id;
				this.createTemplateService.sendCampaignMails(this.obj)
				.subscribe(response => {
					var resp = response;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.stepperEvent.emit("next");
				})
			}else{
				this.createTemplateService.sendCampaignMails(this.obj)
				.subscribe(response => {
					var resp = response;
					this.template_id = resp.template_id;
					this.obj.template_id = resp.template_id;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.stepperEvent.emit("next");
					// this.stepperEvent.emit("last");
				})
			}
		}else{
			window.scrollTo(0,0);
			this.alertsService.changeAlert({value: true});
			this.alertsService.changeAlertsMessage({type: 'error' , message: "Template can't be blank.Please add Content."});
			// alert('Template is blank.Please add content')
		}
	}
	sendAsCancel($event){
		var answer = window.confirm("Your Data will be lost? Are you sure? ");
		if(answer)
		{
			this.commonService.changeHtml("");
			this.editorService.changeTemplate("cancel");
		}
		else
		{
		 	 	
		}
	}
	saveAsDraft($event){
		var htmlData: any;
		if(this.template_id){
			if(this.commnadCheck){
				htmlData = this.html.editors[this.html.editors.length -1].runCommand('gjs-get-inlined-html');
			}else{
				htmlData = this.html.editors[0].runCommand('gjs-get-inlined-html');
				this.commnadCheck = true;		
			}
			htmlData = htmlData.split('</body>')[0];
		}else{
			htmlData = this.html.editors[0].runCommand('gjs-get-inlined-html');
			this.commnadCheck = true;
		}
		if(htmlData.length){
			this.obj.tmpl_value = '<!doctype html><html lang="en"><head><style>' + 
			'</style></head><body>' + 
			htmlData;
			this.obj.token = this.token;
			this.obj.tmpl_name = "Demotest";
			this.obj.tmpl_type = this.tmpl_type;
			this.obj.subject = this.campaignData.subject;
			if(this.template_id){
				this.obj.template_id  = this.template_id;
				this.createTemplateService.sendCampaignMails(this.obj)
				.subscribe(response => {
					var resp = response;
					if(resp.status){
						//send draft call
						this.sendSaveDraftData();
					}
					else{
						window.scrollTo(0,0);
						this.alertsService.changeAlert({value: true});
						this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong.Please comeback later."})
					}
				})
			}else{
				this.createTemplateService.sendCampaignMails(this.obj)
				.subscribe(response => {
					var resp = response;
					if(resp.status){
						this.template_id = resp.template_id;
						//send draft call 
						this.sendSaveDraftData();
					}else{
						window.scrollTo(0,0);
						this.alertsService.changeAlert({value: true});
						this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong>Please comeback later."})
					}
				})
			}

		}else{
			window.scrollTo(0,0);
			this.alertsService.changeAlert({value: true});
			this.alertsService.changeAlertsMessage({type: 'error' , message: "Template can't be blank.Please add content to proceed"});
		}
	}
	sendSaveDraftData(){
		var contactsArray = [];
	    for(var i = 0;i < this.contactData.length;i++){
	      var a = this.contactData[i].contact_list_id.toString();
	      contactsArray.push(a);
	    }
		this.mailObject.token = this.token;
	    this.mailObject.campaign_id = this.campaignData.campaign_id;
	    this.mailObject.template_id = this.template_id;
	    this.mailObject.contact_list = contactsArray.join();
	    this.mailObject.action = "save";
	    if(this.mailObject.contact_list && this.mailObject.template_id && this.mailObject.campaign_id){
		    this.previewService.shootMailsToCustomers(this.mailObject)
		    .subscribe(resp => {
		      if(resp.status){
		      	this.makeGlobalEmpty();
		      	this.alertsService.changeAlert({value: true});
				this.alertsService.changeAlertsMessage({type: 'success' , message: "Campaign data saved successfully."})
		        this.router.navigate(["dashboard/mycampaigns"]);
		      }
		    })
	    }else{
	    	window.scrollTo(0,0);
	    	this.alertsService.changeAlert({value: true});
			this.alertsService.changeAlertsMessage({type: 'error' , message: "Please check the data and contact list."})
	    }
	}
	removeAlert(alert) {
    	this.error_mesages = [];
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
}
