import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
// need  Add contacts ervice to get contacta list;
import {AddContactsService} from '../addcontacts/addcontacts.service';
import {FormBuilder, FormGroup,FormArray,FormControl, Validators, NgForm} from '@angular/forms';
import {RequestOptions,Headers, Http} from '@angular/http';
import * as moment from 'moment'; // add this 1 of 4
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AlertsService} from '../alerts/alerts.service';
import {environment} from '../../../environments/environment';
import 'rxjs/Rx';
import { Ng2FileInputService } from 'ng2-file-input';
declare var jQuery:any;



@Component({
	selector: 'app-contacts',
	templateUrl: './contacts.component.html',
	styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
	token: any;
	allContacts: any;
	storeContactsList: any;
	contactList: any = [];
	contactsSelectForm: FormGroup;
	addContactFormGroup: FormGroup;
  selectedFilter = 'all';
  downloadDisplay = "none";
  downloadContact: any;
	fileInfo: any;
  private url = environment.apiUrl;
	private headers = new Headers({ 'Content-Type': 'application/json' });
	statsCount: any;
	endLimit: any;
	public width: Number;
	isAllowToDelete: boolean = false;
	contactType ={
		token: "",
		status:"" ,
		page_no:""
	}
	allSelected: boolean = false;
	contactObj = {
		token: "",
		contact_list_id: ""
	}
  isTermsAccepted: boolean = false;
	totalItems:number = 30;
	isPageLoaded: boolean = false;
	isContactsEmpty: boolean = false;
	contactStatsData: any;
	isModel = false;
	isDataLoaded: boolean = false;
	isFileUploaded: boolean = false;
	fileName: any;
	isFormError:boolean = false;
	actionLog: any;
  remaining: any;
  myFileInputIdentifier:string = "CustomTextsJPGOnlyInput";

  constructor(
    private commonService: CommonService,
    private addContactsService: AddContactsService,
    private fb: FormBuilder,
    private http: Http,
    private cookieService: CookieService,
    private router: Router,
    private alertsService: AlertsService,
    private ng2FileInputService: Ng2FileInputService) {}
    private applyFormValues (group, formValues) {
    Object.keys(formValues).forEach(key => {
      let formControl = <FormControl>group.controls[key];
      // if (formControl instanceof FormGroup) {
      //   this.applyFormValues(formControl, formValues[key]);
      // } else {
      //   // formControl.setValue(formValues[key]);
      // }
    });
  }
  ngOnInit() {
    this.alertsClear();
    this.commonService.makeTawkHide();
    if(this.cookieService.get('token')){
      this.getUserData();
      this.contactsSelectForm = this.fb.group({
        selectedContacts: this.fb.array([])
      });
      this.addContactFormGroup = this.fb.group({
        contactlist_name: ['', Validators.required],
        // contactlist: ['',Validators.required]
      });
    }else{
      this.router.navigate(['/login']);
    }
  }
// dilouge box
  // openDialog() {
  //   const dialogRef = this.dialog.open(ContactsComponent, {
  //     height: '350px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  getUserData(){
    this.commonService.getUserData();
    this.token = this.cookieService.get('token')
    if(this.token){
      this.getContactsList(this.token);
    }
  }
  getContactsList(token){
    this.contactType.token = this.token;
    this.contactType.status = "all";
    this.contactType.page_no = "1"
    return this.addContactsService.getAllContacts(this.contactType)
    .subscribe(response => {
      this.isDataLoaded = true;
      if(response.status){
        if(response.message.info && response.message.info.length){
          this.allContacts = response.message.info;
          this.storeContactsList = this.allContacts;
          this.getDate(this.allContacts);
          this.getContactsCount(this.allContacts);
        }else{
          this.isContactsEmpty = true;        
        }
        this.isPageLoaded = true;
        this.statsCount = response.message.overall_stats.count;
        this.endLimit = response.message.overall_stats.limit;
        this.width = (this.statsCount / this.endLimit) * 100;
        this.totalItems = (response.message.total_page_number * 10);
        this.remaining = this.endLimit - this.statsCount;
      }else{
        this.isContactsEmpty = true;
        // show no contacts
      }

    })
  }
  getDate(allContacts){
    for(var i = 0; i < allContacts.length; i++){
      var date = this.allContacts[i].created_on.split(" ")[0];
      date = date.split('-');
      this.allContacts[i].created_date = date[2] +  ' ' + moment(date[1], 'MM').format('MMMM').substring(0, 3) + ',  '+ date[0];
    }
  }
  getContactsCount(allContacts){
    for(var i = 0; i < allContacts.length; i++){
      allContacts[i].contacts_total = allContacts[i].stats.undetermined + allContacts[i].stats.valid;
      if(allContacts[i].status == ("Active" || "Rejected")) {
        allContacts[i].isDownload = true;
        allContacts[i].isAbleToDelete = true;
      }else if((allContacts[i].status == "Under Review") || (allContacts[i].status == "Uploaded")){
         allContacts[i].isAbleToDelete = false;
      }else{
        allContacts[i].isAbleToDelete = true;;
      }
    }
  }
  contactSearch($event){
    this.isPageLoaded = true;
    let q = ($event.target.value).toLowerCase();
    this.isContactsEmpty = false;
    this.allContacts = [];
    if(q.length){
      this.addContactsService.searchContact(this.token,q).subscribe(resp => {
        this.allContacts = resp.message.info;
        if(this.allContacts){
          this.getContactsCount(this.allContacts);
          this.getDate(this.allContacts);
          this.isPageLoaded = true;
        }else{
          this.isContactsEmpty = true;
          this.isPageLoaded = false;
        }
      })
    }
    else{
      this.isPageLoaded = true;
      this.allContacts = this.storeContactsList;
    }
  }
  //checkbox click functions
  onChange(contact:any, isChecked: boolean) {
    this.allSelected = false;
    this.contactList = this.allContacts;
    let defaultContacts  = [];
    var count = 0;
    const emailData = <FormArray>this.contactsSelectForm.controls.selectedContacts;
    if(isChecked) {
      emailData.push(new FormControl(contact));
    } else {
      this.isAllowToDelete = false;
      let index = emailData.controls.findIndex(x => x.value == contact.contact_list_id);
      emailData.removeAt(index);
    }
    defaultContacts = emailData.value;
    if(this.contactList.length > 0){
      for(var i = 0; i < this.contactList.length; i++){
        if(defaultContacts.length > 0){
          for(var j = 0;j < defaultContacts.length; j++){
            if(this.contactList[i].contact_list_id == defaultContacts[j].contact_list_id){
              this.contactList[i].isChecked = true;
              this.isAllowToDelete = true;
            }
          }
        }else{
          if(this.contactList[i].contact_list_id == contact.contact_list_id){
            this.contactList[i].isChecked = false;
            this.isAllowToDelete = false;
          }
        }
        if(this.contactList[i].isChecked){
          count += 1;
        }  
      }
      if(count > 0){
        this.isAllowToDelete = true;
      }
    }else{
      if(defaultContacts.length > 0){
        defaultContacts[0].isChecked = true;
        this.contactList = defaultContacts;
        this.isAllowToDelete = true;
      }
      else{
        this.isAllowToDelete = false;
      }
    }
  }
  onCloseImportHandled(){  
    jQuery("#contactsImportsModal").modal("hide");
  }
  onContactUpload(event){
    var data = event.value;
    if(this.fileInfo  && data.contactlist_name) {
      if(this.fileInfo.size <= 5242880){
        let file: File = this.fileInfo;
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
          var resp = response.json();
          if(resp.status){
            //model close event
            jQuery("#contactsImportsModal").modal("hide");
            this.isFormError = false;
            //get call for contactlist
            this.getContactsList(this.token);
            this.alertsService.changeAlert({value: true});
            window.scrollTo(0,0);
            this.alertsService.changeAlertsMessage({type: 'success' , message: "Contact list uploaded successfully"});
            this.fileName = "";
            this.isFileUploaded = false;
          }else{
            this.isFormError = true;
            this.alertsService.changeAlert({value: true});
            this.alertsService.changeAlertsMessage({type: 'error' , message: resp.message});
          }
        })
      }else{
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: "File size can't excced more than 5mb"});  
      }
    }else{
      this.isFormError = true;
      this.alertsService.changeAlert({value: true});
      this.alertsService.changeAlertsMessage({type: 'error' , message: "File and name can't blank."});
    }
  }
  fileChange(event){
    let fileList: FileList = event.target.files;
    this.fileInfo = fileList;
    this.isFileUploaded = true;
    this.fileName = this.fileInfo[0].name;
  }
  onSelectAll(isSelected: boolean){
    if(isSelected){
      //activate delete button and select all inputs
      this.isAllowToDelete = true;
      this.allSelected = true;
      this.contactList = this.allContacts;
      for(var j = 0; j< this.allContacts.length;j++){
        if(this.allContacts[j].isAbleToDelete){
          this.allContacts[j].isChecked = true;
        }else{
          this.allContacts[j].isChecked = false;
        }
      }
    }else{
      //remove all selected checkboxes for Inputs
      this.isAllowToDelete = false;
      this.allSelected = false;
      this.contactList = [];
      for(var j = 0; j< this.allContacts.length;j++){
        this.allContacts[j].isChecked = false;
      }
    }
  }
  onContactDelete($event){
    this.contactObj.token = this.token;
    var contactsArray = [];
    if(this.allSelected){
      var alert = window.confirm("Are you sure want to delete all Contacts")
      if(alert){
        for(var i = 0;i < this.allContacts.length;i++){
          if(this.allContacts[i].isAbleToDelete){
            var a = this.allContacts[i].contact_list_id.toString();
            contactsArray.push(a);
          }  
        }
      }
    }else{
      var answer = window.confirm("Are you sure want to delete contacts? ");
      if(answer)
      {
        for(var i = 0;i < this.contactList.length;i++){
          if(this.contactList[i].isChecked){
            var a = this.contactList[i].contact_list_id.toString();
            contactsArray.push(a);
          }
        }
      }
    }
    this.contactObj.contact_list_id = contactsArray.join();
    this.contactDeleteProceed();
  }
  public getServerData(event){
    this.contactType.token = this.token;
    this.contactType.page_no = event;
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
          this.getContactsCount(this.allContacts);
          this.getDate(this.allContacts);
        }
      },
      error =>{
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: "Max number of pages reached"});
      }
      );
    return event;
  }
  openModal($event,contact){
    this.contactStatsData = contact;
  }
  onCloseHandled(){
    this.isFormError = false;
  }
  alertsClear(){
    this.alertsService.changeAlert({value: false});
  };
  public onAction(event: any){
    this.actionLog += "\n currentFiles: " + this.getFileNames(event.currentFiles);
  }
  public onAdded(event: any){
    console.log(event);
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File added";
    this.fileInfo = event.file;
    this.isFileUploaded = true;
    this.fileName = this.fileInfo.name;
    // this.applyFormValues(this.addContactFormGroup, {contact_list_name: this.fileName});
  }
  public onRemoved(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File removed";
    this.fileInfo = "";
    this.fileName = "";
    this.isFileUploaded = false;
  }
  public onInvalidDenied(event: any){
    this.actionLog += "\n FileInput: "+event.id;
    this.actionLog += "\n Action: File denied";
    this.fileInfo = "";
    this.fileName = "";
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
  onSingleDeleteClick(ev, contact){
    var answer = window.confirm("Are you sure want to delete contacts? ");
    if(answer){
      this.contactObj.contact_list_id = contact.contact_list_id;
      this.contactObj.token = this.token;
      this.contactDeleteProceed();
    }
  }
  contactDeleteProceed(){
    this.addContactsService.deleteContactList(this.contactObj)
    .subscribe(resp => {
      var res = resp;
      if(resp.status){
        this.contactType.token = this.token;
        this.contactType.status = "all";
        // show success response and update array
        this.addContactsService.getAllContacts(this.contactType)
        .subscribe(conres => {
          if(conres.status){
            this.allContacts = conres.message.info;
            this.getContactsCount(this.allContacts);
            this.statsCount = conres.message.overall_stats.count;
            this.endLimit = conres.message.overall_stats.limit;
            this.width = (this.statsCount / this.endLimit) * 100;
            this.getDate(this.allContacts);
            this.isAllowToDelete = false;
            window.scrollTo(0,0);
            this.alertsService.changeAlert({value: true});
            this.alertsService.changeAlertsMessage({type: 'success' , message: resp.message});
          }else{
            window.scrollTo(0,0);
            this.alertsService.changeAlert({value: true});
            this.alertsService.changeAlertsMessage({type: 'error' , message: "Something wrong.Please try after sometime."});
          }
        })
      }else{  
        // error while deletng
        window.scrollTo(0,0);
        this.alertsService.changeAlert({value: true});
        this.alertsService.changeAlertsMessage({type: 'error' , message: resp.message});
      }
    })
  }
  onChangeTerms(value: boolean){
    if(value == true){
      this.isTermsAccepted = true;
    }else{
      this.isTermsAccepted = false;
    }
  }
  onContactTypeChange($event,value){
    this.isPageLoaded = false;
    this.contactType.token = this.token;
    this.contactType.status = value;
    this.contactType.page_no = "1"
    this.allContacts = [];
    this.addContactsService.getAllContacts(this.contactType)
    .subscribe(response => {
      this.isDataLoaded = true;
      if(response.status){
        if(response.message.info && response.message.info.length){
          this.allContacts = response.message.info;
          this.isContactsEmpty = false;
          this.storeContactsList = this.allContacts;
          this.getDate(this.allContacts);
          this.getContactsCount(this.allContacts);
        }else{
          this.isContactsEmpty = true;        
        }
        this.statsCount = response.message.overall_stats.count;
        this.endLimit = response.message.overall_stats.limit;
        this.width = (this.statsCount / this.endLimit) * 100;
        this.totalItems = (response.message.total_page_number * 10);
        this.remaining = this.endLimit - this.statsCount;
        this.isPageLoaded = true;
      }else{
        this.isContactsEmpty = true;
      }

    })
  }
  openDownloadModal($event,contact){
    this.downloadContact = contact;
  }
  onCloseDownloadHandled(){
    this.downloadContact = "";
    jQuery("#contactsDownloadModal").modal("hide");
  }
  onSampleDownload($event){
    // api call for download 
  }
  onDownloadCSV($event, value){
    this.addContactsService.downloadCsv(this.token, value,this.downloadContact.contact_list_id)
    .subscribe(
        success => {
            var filename = this.downloadContact.list_name+'-'+ value+'.csv';
            var blob = new Blob([success["_body"]], { type: 'text/csv' });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            this.onCloseDownloadHandled();
        },
        err => {
            alert("Server error while downloading file.");
        }
    );
   }
   onImportModalClick($event){
     this.addContactFormGroup.reset();
     this.isTermsAccepted = false;
     this.ng2FileInputService.reset(this.myFileInputIdentifier);
   }
}
