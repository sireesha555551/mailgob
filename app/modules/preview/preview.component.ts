import { Component, OnInit ,ViewChild,Output,EventEmitter,ViewContainerRef} from '@angular/core';
import {CommonService} from '../common.service';
import {PreviewService} from './preview.service';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {EditorService} from '../editor.service';
import {AlertsService} from '../alerts/alerts.service';
import {RequestOptions,Headers, Http} from '@angular/http';
import{AuthService} from '../auth.service';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
	contactData: any;
	campaignData: any;
	templateData: any;
	@ViewChild(CommonService) dataService;
	contactLength: any;
	response: any;
	private mailObject = {
		token: "",
		campaign_id: "",
		template_id: "",
		contact_list: "",
    action: ""
	}
  actionLog: any;
  isFileUploaded: boolean = false;
  fileInfo: any;
  fileName: any;
  error_alerts: any =[];
	token: any;
  attachments: any;
  display = 'none'; 
  testEmail: any = localStorage.getItem('email');
  @Output() stepperEvent = new EventEmitter<string>();
  exp = /(\w(=?@)\w+\.{1}[a-zA-Z]{2,})/i;
  private url = environment.apiUrl;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(
  	private commonService: CommonService,
  	private previewService: PreviewService,
    private router: Router,
    private cookieService: CookieService,
    private editorService: EditorService,
    private alertsService: AlertsService,
    private http: Http,
    private authService: AuthService
  	) {
  }

  ngOnInit() {
    this.alertsClear();
    if(this.cookieService.get('token')){
    	this.getUserData();
    	this.commonService.currentMessage.subscribe(message => this.campaignData = message);
    	this.commonService.currentContact.subscribe(contactData => {
    	this.contactData = contactData});
    	this.commonService.currentTemplate.subscribe(templateData => this.templateData = templateData);
      this.commonService.currentAttachment.subscribe(attach => this.attachments = attach);
    	this.contactLength = this.contactData.length;
    }else{
      this.router.navigate(['/login']);
    }
  }
  getUserData(){
  	this.commonService.getUserData();
  	this.token = this.cookieService.get('token');
  }
	onSendClick($event){
		var contactsArray = [];
    for(var i = 0;i < this.contactData.length;i++){
      var a = this.contactData[i].contact_list_id.toString();
      contactsArray.push(a);
    }
    this.mailObject.contact_list = contactsArray.join();
    this.mailObject.token = this.token;
		this.mailObject.campaign_id = this.campaignData.campaign_id;
		this.mailObject.template_id = this.templateData.template_id;
    this.mailObject.action ="send";
    this.sendCampaignData(this.mailObject);
	}
  onSaveDraftClick($event){
    var contactsArray = [];
    for(var i = 0;i < this.contactData.length;i++){
      var a = this.contactData[i].contact_list_id.toString();
      contactsArray.push(a);
    }
    this.mailObject.contact_list = contactsArray.join();
    this.mailObject.token = this.token;
    this.mailObject.campaign_id = this.campaignData.campaign_id;
    this.mailObject.template_id = this.templateData.template_id;
    this.mailObject.action = "save";
    this.sendCampaignData(this.mailObject);
  }
  onCampaignDataEdit($event){
    this.stepperEvent.emit('campaign');
  }
  //service call to send or save campaign and template and contact data 
  sendCampaignData(mailObject){
   if(mailObject.campaign_id && mailObject.template_id && mailObject.campaign_id){
      this.previewService.shootMailsToCustomers(this.mailObject)
      .subscribe(resp => {
        this.response = resp;
        if(resp.status){
          this.makeGlobalEmpty();
          this.authService.changeCurrentParam('save');
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'success' , message: resp.message});
          setTimeout(()=>{
            this.router.navigate(["dashboard/mycampaigns"]);
          },3000);    
        }else{
          window.scrollTo(0,0);
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong.Sorry for the inconvinience."})
        }
      })
    }else{
      window.scrollTo(0,0);
      this.alertsService.changeAlert({value: true});
      this.alertsService.changeAlertsMessage({type: 'error' , message: "Please make sure that all required fields are filled."})
    } 
  }
  removeAlert(alert) {
    this.error_alerts = [];
  }
  makeGlobalEmpty(){
    this.commonService.changeHtml('');
    this.commonService.changeMessage('');
    this.commonService.changeContact('');
    this.commonService.changeTemplate('');
    this.editorService.changeTemplate('')
  }
  onTestMailClick($event,testEmail){
    if(this.campaignData.campaign_id && this.templateData.template_id, this.exp.test(testEmail)){
      this.previewService.sendTestEMail(testEmail, this.token, this.templateData.template_id,this.campaignData.campaign_id)
      .subscribe(resp => {
        window.scrollTo(0,0);
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'success' , message: "Mail sent.Please check your inbox."})
        // this.testEmail = ''
      })
    }else{
      if(testEmail && !this.exp.test(testEmail)){
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: "Please enter a valid Email."});
      }else{
        window.scrollTo(0,0);
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: "Please check all input fields."});
      }
    }
  }
  alertsClear(){
    this.alertsService.changeAlert({value: false});
  };

  public onAction(event: any){
    this.actionLog += "\n currentFiles: " + this.getFileNames(event.currentFiles);
  }
  public onAdded(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File added";
    this.fileInfo = event.file;
    // this.fileName = this.fileInfo.name;
  }
  public onRemoved(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File removed";
    this.fileInfo = "";
    // this.fileName = "";
    this.isFileUploaded = false;
  }
  public onInvalidDenied(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File denied";
    this.fileInfo = "";
    // this.fileName = "";
    this.isFileUploaded = false;
  }
  public onCouldNotRemove(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: Could not remove file";
  }
  private getFileNames(files:File[]):string{
    let names=files.map(file => file.name);
    return names ? names.join(", "): "No files currently added.";
  }
  onFileUploadClick($event){
    if(this.fileName && this.fileInfo){
      let file: File = this.fileInfo;
      let formData:FormData = new FormData();
      formData.append('attachedfile', file, file.name);
      formData.append('attachfile_name', this.fileName);
      formData.append('token', this.token);
      formData.append('campaign_id', this.campaignData.campaign_id);
      let headers = new Headers();
      // * No need to include Content-Type in Angular 4 
      // headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post(`${this.url}/campaign/attachment` ,formData, options)
      .subscribe(resp => {
          var a  = resp.json();
        if(a.status){
          this.display='none'; 
          this.isFileUploaded = true;
          this.attachments = a.message;
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'success' , message: "Attachment added sucessfully"})

        }else{
          this.isFileUploaded = false;
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: a.message})

        }
      })

    }else{
      // throw error
      this.alertsService.changeAlert({value: true});
      this.alertsService.changeAlertsMessage({type: 'error' , message: 'File/filename missing.'})
    }
  }
  onDeleteAttachment(id,event){
    this.previewService.deleteAttachment(id, this.token, this.campaignData.campaign_id)
    .subscribe(resp => {
        if(resp.status){
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'success' , message: "Attachment deleted successfully."})
          for(var i = 0; i < this.attachments.length; i++){
            if(id == this.attachments[i].id){
              this.attachments.splice(i, 1);
            }
          }
        }
        else{
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: resp.message})
        }
    })
  }
  openModal($event){
     this.display= 'block'; 
  }
  onCloseHandled($event){
    this.display='none'; 
  }

}
