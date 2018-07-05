import { Component, OnInit,ViewEncapsulation ,Input,Output,EventEmitter} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {FormBuilder, FormGroup,FormArray,FormControl, Validators, NgForm} from '@angular/forms';
import {AddContactsService} from './addcontacts.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import {Router} from '@angular/router';
import {CommonService} from '../common.service';
import { CookieService } from 'ngx-cookie-service';
import {AlertsService} from '../alerts/alerts.service';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.component.html',
  styleUrls: ['./addcontacts.component.scss']
})


export class AddcontactsComponent implements OnInit {
  file:any;
  private url = environment.apiUrl;
  // private url = `https://api.mailgob.com`;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });
  private token: any;
  public allContacts: any;
  display='none';
  importDisplay='none';
  page: any;
  encapsulation: ViewEncapsulation.None;
  addContactFormGroup: FormGroup;
  contactsSelectForm: FormGroup;
  fileInfo: any;
  getContacts: any;
  success_alerts: any =[];
  error_alerts: any=[];
  storeContactsList: any = [];
  contactStatsData: any;
  myFiles: Array<FileInfo>;
  contactListIds: any =[];
  contactList: any=[];
  @Output() stepperEvent = new EventEmitter<string>();
  selectedContactsArray: any = [];
  storedContacts: any = [];
  contactType ={
    token: "",
    status:"" ,
    page_no:""
  }
  totalItems: number = 60;
  isDataLoaded: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private addContactsService: AddContactsService,
    private http: Http,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private cookieService: CookieService,
    private alertsService: AlertsService
    ) { }
  private obj ={
    key: ""
  }

  @Input() childMessage: string;

  ngOnInit() {
    this.alertsClear();
    if(this.cookieService.get('token')){
      this.getUserData();
      this.addContactFormGroup = this._formBuilder.group({
        contactlist_name: ['', Validators.required],
        contactlist: ['',Validators.required]
      });
      this.contactsSelectForm = this.fb.group({
        selectedContacts: this.fb.array([])
      });
    }else{
      this.router.navigate(['/login']);
    }
  }
  getSelectedContacts(){
    //from draft status campaigns
    this.commonService.currentContact.subscribe(contactData => {
      this.isDataLoaded = true;
      this.selectedContactsArray = contactData;
      if(this.selectedContactsArray.length > 0){
        for(var j = 0; j< this.allContacts.length;j++){
          for(var i = 0; i < this.selectedContactsArray.length; i++){
            if(parseInt(this.selectedContactsArray[i].contact_list_id) == this.allContacts[j].contact_list_id){
              this.allContacts[j].isChecked = true;
              this.allContacts[j].contact_list_id = parseInt(this.allContacts[j].contact_list_id);
              this.storedContacts.push(this.allContacts[j]);
            }
          }
        }
      }else{
        this.selectedContactsArray = [];
      }
    });
  }
  getUserData(){
    this.token  = this.cookieService.get('token');
    if(this.token){
      this.getContactsList(this.token);
    }
    this.commonService.getUserData()    
  }
  uploadEventHandler(e) {
    this.fileInfo = e.files
  }
  fileChangeListener($event): void {
    var text = [];
    var target = $event.target || $event.srcElement;
    var files = target.files; 
    this.fileInfo = files;
  }

  selectEventHandler(event: any){
    this.fileInfo = event;
  }

  onContactUpload(event){
    var data = event.value;
    if(this.fileInfo && this.fileInfo.length && data.contactlist_name) {
      let file: File = this.fileInfo[0];
      let formData:FormData = new FormData();
      formData.append('contactlist', file, file.name);
      formData.append('contactlist_name', data.contactlist_name);
      formData.append('token', this.token)
      let headers = new Headers();
      // * No need to include Content-Type in Angular 4 
      // headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post(`${this.url}/contacts/upload` ,formData, options)
      .subscribe(response =>  {
        var resp = response
        if(resp.status){
          //model close event
          this.importDisplay = 'none';
          //get call for contactlist
          this.getContactsList(this.token);
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'success' , message: 'Contact list added successfully.After veryfing all contacts you are able to select contact list'});
        }else{
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: resp});
        }
      })
    }
    else{
      this.alertsService.changeAlert({value: true});
      this.alertsService.changeAlertsMessage({type: 'error' , message: "File and name can't be blank"})
    }
  }
  // making alerts empty
  removeAlert(alert) {
    this.success_alerts = [];
    this.error_alerts = [];
  }
  fileChange(event){
    let fileList: FileList = event.target.files;
    this.fileInfo = fileList;
  }
  getContactsList(token){
    var obj = {
      token: token,
      status: "active",
      page_no: 1
    }
    return this.addContactsService.getAllContacts(obj)
    .subscribe(response => {
      this.allContacts = response.message.info;
      this.totalItems = response.message.total_contacts;
      this.getSelectedContacts();
      this.storeContactsList = this.allContacts;
    })
  }
  contactSearch($event){
    let q = ($event.target.value).toLowerCase();
    this.allContacts = [];
    if(q.length){
      for(var i = 0;i < this.storeContactsList.length; i++){
        var is_found  = this.storeContactsList[i].list_name.toLowerCase().indexOf(q);
        if(is_found >= 0){
          this.allContacts.push(this.storeContactsList[i]);
        }
      }
    }
    else{
      this.allContacts = this.storeContactsList;
    }
  }

  //checkbox click functions
  onChange(contact:any, isChecked: boolean) {
    var selectedContactsList: any;
    const emailData = <FormArray>this.contactsSelectForm.controls.selectedContacts;
    if(isChecked) {
      emailData.push(new FormControl(contact));
      let list = new FormControl(contact).value;
       this.selectedContactsArray.push(list);
    } else {
      for(var i = 0;i< this.selectedContactsArray.length;i++ ){
        if(contact.contact_list_id == this.selectedContactsArray[i].contact_list_id){
          this.selectedContactsArray.splice(i, 1);
        }
      }
      let index = emailData.controls.findIndex(x => x.value == contact.contact_list_id);
      emailData.removeAt(index);
    }
    this.contactList = emailData.value;
    for(var i = 0; i < this.allContacts.length; i++){
      if(this.allContacts[i].contact_list_id == contact.contact_list_id){
        this.allContacts[i].isChecked = isChecked;
      }
    }
  }

  //models handling functions
  openModal($event,contact){
    this.contactStatsData = contact;
    this.display= 'block'; 
  }
  openImportsModal($event){
    this.importDisplay='block';
  }

  onCloseHandled(){
    this.display='none'; 
  }
  onCloseImportHandled(){
    this.importDisplay='none';
  }

  moveToNextStage($event){
    var contactsStoredArray = [];
    console.log(this.selectedContactsArray);
    if(this.allContacts.length){
      if(this.selectedContactsArray.length){
        this.commonService.changeContact(this.selectedContactsArray);
        this.stepperEvent.emit("next");

      }else{
        //throwing error
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: 'Please add atleast one contact to proceed'}); 
      }
    }
    else{
      //throwing error
      this.alertsService.changeAlert({value: true});
      this.alertsService.changeAlertsMessage({type: 'error' , message: 'No Contacts in Your list.Please add contactlist to proceed'});
    }
  }
  alertsClear(){
    this.alertsService.changeAlert({value: false});
  };
  onAddContacts($event){
    alert("Campaign stored.After verifying contacts list please resume the campaign.");
    this.router.navigate(['dashboard/contacts']);
  }
  public getServerData(event){
    this.contactType.token = this.token;
    this.contactType.page_no = event;
    this.contactType.status = "active";
    this.addContactsService.getAllContacts(this.contactType).subscribe(
      response =>{
        if(response.error) { 
          this.alertsService.changeAlert({value: true});
          this.alertsService.changeAlertsMessage({type: 'error' , message: "Something went wrong.Please try after sometime"});
          alert('Server Error');
        } else {
          this.allContacts = [];
          this.allContacts = response.message.info;
          this.storeContactsList = this.allContacts;
          this.getSelectedContacts();
        }
      },
      error =>{
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: "Max number of pages reached"});
      }
      );
    return event;
  }
}
