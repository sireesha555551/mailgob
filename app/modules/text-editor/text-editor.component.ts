import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import {CommonService} from '../common.service';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {EditorService} from '../editor.service';
import {PreviewService} from '../preview/preview.service';
import {CreateTemplateService} from '../createtemplate/createtemplate.service';
import {AlertsService} from '../alerts/alerts.service';
import * as ckeditor from 'ng2-ckeditor';
import {RequestOptions,Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';

// import { FormBuilder, FormGroup } from '@angular/forms';
// Jquery declaration
declare var $: any;

@Component({
	selector: 'app-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
	// private _formBuilder: FormBuilder;
  // savePostForm: FormGroup;  

  content: any ="";
  constructor(
  		// formBuilder: FormBuilder,
  		private commonService: CommonService,
  		private cookieService: CookieService,
  		private router: Router,
  		private editorService: EditorService,
  		private previewService: PreviewService,
  		private createTemplateService: CreateTemplateService,
  		private alertsService: AlertsService,
  		private http: Http,
  		private authService: AuthService) { 
  	// this._formBuilder = formBuilder;    
    // this.savePostForm = this._formBuilder.group({ })

  // this.content = '';
}

tmpl_type: any;
campaignData: any;
contactData: any;
token: string;
template_id: any;
templateData: any;
template: any;
ckEditor: any
private obj ={
	token: "",
	tmpl_name: "",
	tmpl_value: "",
	subject:"",
	template_id:"",
	tmpl_type: ""
}
private mailObject = {
	token: "",
	campaign_id: "",
	template_id: "",
	contact_list: "",
	action: ""
}
private url = environment.apiUrl;
// private url = `https://api.mailgob.com`;
private headers = new Headers({ 'Content-Type': 'application/json' });
showFiles: boolean = true;
@Output() stepperEvent = new EventEmitter<string>();
ngOnInit() {
	this.alertsClear();
	this.commonService.makeTawkHide();
	this.ckEditor = ckeditor;
	if(this.cookieService.get('token')){
		this.getUserData();
		this.editorService.editortype.subscribe(message => {
			this.tmpl_type = message;
		})
		this.commonService.currentMessage.subscribe(message => this.campaignData = message);
		this.commonService.currentContact.subscribe(contactData => {
			this.contactData = contactData});
		this.commonService.html.subscribe(message => {
			this.content = message
		});
		var self  = this;
		$('#summernote').summernote(
			{callbacks: {
				onImageUpload : function(files) {
					var file = files[0];
					let formData:FormData = new FormData();
		  		formData.append('image', file, file.name);
		  		formData.append('campaign_id', self.campaignData.campaign_id );
		  		formData.append('campaign_name', self.campaignData.campaign_name );
		  		formData.append('token', self.token)
		  		let headers = new Headers();
		  		headers.append('Accept', 'application/json');
      		let options = new RequestOptions({ headers: headers });
      		self.http.post(`${self.url}/campaign/gallery` ,formData, options)
     			 .subscribe(response =>  {
     			 	var resp = response.json();
     			 	if(resp.status){
     			 		$(this).summernote('insertImage', resp.message);
     			 	}else{
     			 		this.alertsService.changeAlert({value: true});
							this.alertsService.changeAlertsMessage({type: 'error' , message: "Sorry for the inconvinience. Please try again."});
     			 	}
     			 })
				}
			}
		});
		$('#summernote').summernote('code', this.content);
	}else{
		this.router.navigate(['/login']);
	}
}
sendFile(file,editor,welEditable){
	console.log(file)
}
getUserData(){
	this.token  = this.cookieService.get('token');
	if(this.token){
		this.commonService.currentTemplate.subscribe(message => {
			this.templateData = message;
			this.template_id = this.templateData.template_id;
			this.template = this.templateData.templatedata;
			this.commonService.changeHtml(this.template);
				// this.html = this.gbc.message;
						// now manipulate the grapejs Html
					});
	}else{
		this.router.navigate(['/login']);			
	}
}
sendAsEvent($event){
	this.obj.token = this.token;
	this.obj.tmpl_name = "Demotest";
	this.obj.tmpl_type = this.tmpl_type;
	var content = $("#summernote").val()
	this.obj.subject = this.campaignData.subject;
	this.obj.tmpl_value = content;
	
	if(content.length){
		if(this.template_id){
			this.obj.template_id = this.template_id;
			this.createTemplateService.sendCampaignMails(this.obj)
			.subscribe(response => {
				if(response.status){
					var resp = response;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.stepperEvent.emit("next");
					this.stepperEvent.emit("last");
				}else{
					window.scrollTo(0,0);
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
				}
			})
		}else{
			this.createTemplateService.sendCampaignMails(this.obj)
			.subscribe(response => {
				if(response.status){
					var resp = response;
					this.template_id = resp.template_id;
					this.obj.template_id = resp.template_id;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.stepperEvent.emit("next");
					this.stepperEvent.emit("last");
				}else{	
					window.scrollTo(0,0);
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
				}
			})
		}
	}else{
		window.scrollTo(0,0);
		this.alertsService.changeAlert({value: true});
		this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
	}
}
saveAsDraft($event){
	this.obj.token = this.token;
	this.obj.tmpl_name = "Demotest";
	this.obj.tmpl_type = this.tmpl_type;
	this.obj.subject = this.campaignData.subject;
	var content = $("#summernote").val()
	this.obj.tmpl_value = content;
	if(content){
		if(this.template_id){
			this.obj.template_id = this.template_id;
			this.createTemplateService.sendCampaignMails(this.obj)
			.subscribe(response => {
				if(response.status){
					var resp = response;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.saveSendData();
				}else{
					window.scrollTo(0,0);
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
				}
			})
		}else{
			this.createTemplateService.sendCampaignMails(this.obj)
			.subscribe(response => {
				if(response.status){
					var resp = response;
					this.template_id = resp.template_id;
					this.obj.template_id = resp.template_id;
					this.commonService.templateData = this.obj;
					this.commonService.changeTemplate(this.obj);
					this.commonService.changeHtml(this.obj.tmpl_value);
					this.saveSendData();
				}else{
					window.scrollTo(0,0);
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
				}
			})
		}
	}else{
		window.scrollTo(0,0);
		this.alertsService.changeAlert({value: true});
		this.alertsService.changeAlertsMessage({type: 'error' , message: "Please add Content to proceed"});
	}
}
sendAsCancel($event){
	var answer = window.confirm("Your Data will be lost? Are you sure? ");
	if(answer){
		this.content = "";
		this.commonService.changeHtml("");
		this.editorService.changeTemplate("cancel");
	}
}
saveSendData(){
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
	if(this.mailObject.contact_list && this.campaignData.campaign_id && this.template_id){
		this.previewService.shootMailsToCustomers(this.mailObject)
		.subscribe(resp => {
			if(resp.status){
				this.makeGlobalEmpty();
				this.authService.changeCurrentParam('save');
				this.alertsService.changeAlert({value: true});
				this.alertsService.changeAlertsMessage({type: 'success' , message: "Campaign Data saved successfully"});
				setTimeout(()=>{
            		this.router.navigate(["dashboard/mycampaigns"]);
          		},3000);   
			}
			else{
				this.alertsService.changeAlert({value: true});
				this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong.Please comeback later."});
			}
		})	

	}else{
		this.alertsService.changeAlert({value: true});
		this.alertsService.changeAlertsMessage({type: 'error' , message: "Please check the campaign and contact list once"})
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
}
