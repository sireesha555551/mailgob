import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder, NgForm, AbstractControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SettingsService } from './settings.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { AlertsService } from '../alerts/alerts.service';
import { AuthService } from './../auth.service';
import { RequestOptions, Headers, Http } from '@angular/http';
import {environment} from '../../../environments/environment';




@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  token: any;
  details: any;
  data = {
    new_firstname: "",
    new_secondname: "",
    email: "",
    new_city: "Hyderabad",
    new_contactnumber: "",
    new_companyname: "",
    new_address1: "",
    new_address2: "",
    new_zip: ""
    // country: ""
  };
  Form: FormGroup;
  resetPasswordForm: FormGroup;
  formGroup: FormGroup;
  selected: any = "";
  countryName: any = {
    id: "",
    name: ""
  }
  stateName: any = {
    id: "",
    name: ""
  }
  userPassword = {
    password: "",
    token: ""
  }
  isMatched: boolean = false;
  errorHide: boolean = false;
  countryId: any = ""
  states: any = [];
  countries: any = [];
  isEdit: boolean = false;
  selectedState: any = "";
  userBasicInfo: any;
  isProPic: boolean = false;
  userproPic: any;
  fileInfo: any;
  actionLog: any;
  stateId: any;
  ref_code: any;
  
  private url = environment.apiUrl;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  // password validation
  static MatchPassword(AC: AbstractControl) {
    let new_password = AC.get('new_password').value; // to get value in input tag
    let confirm_password = AC.get('confirm_password').value; // to get value in input tag
    if (new_password != confirm_password) {
      AC.get('confirm_password').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }


  constructor(
    private settingsService: SettingsService,
    private cookieService: CookieService,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private alertsService: AlertsService,
    private http: Http) {
  }
  private applyFormValues(group, formValues) {
    // console.log(group);
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

    this.getUserData();
    this.getCountry();
    this.alertsClear();
    this.commonService.makeTawkHide();
    this.Form = this._formBuilder.group({
      new_firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]
),
      new_secondname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      new_contactnumber: new FormControl('', Validators.pattern('^[0-9]+$')),
      new_city: new FormControl(''),
      email: new FormControl('', Validators.required),
      new_companyname: new FormControl(''),
      new_address1: new FormControl(''),
      new_address2: new FormControl(''),
      new_zip: new FormControl('',Validators.pattern('^[0-9]+$'))
    });
    this.resetPasswordForm = this._formBuilder.group({
      password: new FormControl('', Validators.required),
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    },
      {
        validator: SettingsComponent.MatchPassword // your validation method
      }
    );
    this.formGroup = this._formBuilder.group({})
    this.formGroup.disable();

  }
  // binding the form data 
  getUserData() {
    this.commonService.getUserData();
    this.token = this.cookieService.get('token');
    if (this.token) {
      this.settingsService.postSettingsData(this.token).subscribe(response => {
        this.selected = response.message.country;
        this.data.new_firstname = response.message.first_name;
        this.data.new_secondname = response.message.last_name;
        this.data.email = response.message.email;
        this.data.new_contactnumber = response.message.contact_number;
        this.data.new_city = response.message.city;
        this.data.new_companyname = response.message.company_name;
        this.data.new_address1 = response.message.address1;
        this.data.new_address2 = response.message.address2;
        this.data.new_zip = response.message.zip;
        this.countryName.name = response.message.country;
        this.countryName.id = response.message.cid;
        this.stateName.name = response.message.state;
        this.stateName.id = response.message.sid;
        this.applyFormValues(this.Form, this.data);
        this.getStates();
        this.userBasicInfo = response.message;
        this.countryId = response.message.cid;
        this.stateId = response.message.sid;
        this.selectedState = response.message.state;
        this.userproPic = response.message.profile_pic;
        this.ref_code = response.message.ref_code;
        if (this.userproPic) {
          this.isProPic = true;
        }
      })
    } else {

    }
  }


  //  form submition response
  onSubmit(userDataForm: NgForm) {
    if (this.isEdit) {
      var userData = userDataForm.value;
      userData.token = this.token;
      userData.new_cid = parseInt(this.countryId);
      userData.new_sid = parseInt(this.stateId);
      if (userDataForm.valid) {
        this.settingsService.getAllProfileData(userData).subscribe(response => {
          if (response.status) {
            //throw success alert
            window.scrollTo(0, 0);
            this.isEdit = false;
            this.alertsService.changeAlert({ value: true });
            this.alertsService.changeAlertsMessage({ type: 'success', message: "Changes made successfully." });
          } else {
            // error alert
            window.scrollTo(0, 0);
            this.alertsService.changeAlert({ value: true });
            this.alertsService.changeAlertsMessage({ type: 'error', message: response.message });
          }
        })

      } else {
        window.scrollTo(0, 0);
        this.alertsService.changeAlert({ value: true });
        this.alertsService.changeAlertsMessage({ type: 'error', message: "Please fill required fields" });
      }
    } else {
      window.scrollTo(0, 0);
      this.alertsService.changeAlert({ value: true });
      this.alertsService.changeAlertsMessage({ type: 'error', message: "Please click on edit to save" });
    }
  }
  // form getting country
  getCountry() {
    this.token = this.cookieService.get('token');
    this.settingsService.settingsCountry(this.token).subscribe(resp => {
      var dataObj = {}
      for (let key in resp.message) {
        let value = resp.message[key];
        dataObj["id"] = key;
        dataObj["name"] = value;
        this.countries.push(dataObj);
        dataObj = {};
      }
    })
  }
  getStates() {
    //get states 
    this.settingsService.getStates(this.countryName.id)
      .subscribe(resp => {
        // console.log(resp)
        var dataObj = {}
        for (let key in resp.message) {
          let value = resp.message[key];
          dataObj["id"] = key;
          dataObj["name"] = value;
          this.states.push(dataObj);
          dataObj = {};
        }
      })
  }
  onEditClick($event) {
    this.isEdit = true;
  }
  onChangeCountry($event, value) {
    this.selected = value;
    for (var i = 0; i < this.countries.length; i++) {
      if (this.selected == this.countries[i].name) {
        this.countryId = this.countries[i].id;
        break;
      }
    }
    this.states = [];
    this.settingsService.getStates(this.countryId)
      .subscribe(resp => {
        if (resp.status) {
          var dataObj = {}
          for (let key in resp.message) {
            let value = resp.message[key];
            dataObj["id"] = key;
            dataObj["name"] = value;
            this.states.push(dataObj);
            dataObj = {};
          }
        } else {
          // data error
        }
      })
  }
  onStateChange($event, value) {
    this.selectedState = value;
    for (var i = 0; i < this.states.length; i++) {
      if (this.selectedState == this.states[i].name) {
        this.stateId = this.states[i].id;
        break;
      }
    }
  }
  currentPassword(event: any) {
    var cp = event.target.value;
    this.errorHide = false;
    this.userPassword.password = cp;
    this.userPassword.token = this.token;
    this.settingsService.getCurrentPassword(this.userPassword).subscribe(response => {
      this.errorHide = true;
      if (response.status) {
        this.isMatched = true;

      } else {
        this.isMatched = false;
      }
    })
  }
  changePassword(d: NgForm) {
    let data = d.value;
    // console.log(data);
    this.settingsService.postNewPassword(data, this.token).subscribe(response => {
      if (response.status) {
        this.commonService.makeUserLogout();
        this.alertsService.changeAlert({ value: true });
        this.alertsService.changeAlertsMessage({ type: 'success', message: "Password reset successfully completed.Please login again" });
        this.authService.afterResetLogout();
      }
      else {
        this.alertsService.changeAlert({ value: true });
        this.alertsService.changeAlertsMessage({ type: 'error', message: response.message });
      }
    })
  }
  alertsClear() {
    this.alertsService.changeAlert({ value: false });
  };

  public onAction(event: any) {
    this.actionLog += "\n currentFiles: " + this.getFileNames(event.currentFiles);
  }
  public onAdded(event: any) {
    this.actionLog += "\n FileInput: " + event.id;
    this.actionLog += "\n Action: File added";
    this.fileInfo = event.file;
    //send data to aws and return URL 
    let file: File = this.fileInfo;
    let formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('token', this.token);
    let headers = new Headers();
    // * No need to include Content-Type in Angular 4 
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post(`${this.url}/userprofile/profilepic`, formData, options)
      .subscribe(resp => {
        var a = resp.json();
        if (a.status) {
          // appending image to url
          this.isProPic = true;
          this.userproPic = a.message;
          this.authService.getUserBasicInformation(this.token)

        } else {
          this.isProPic = false;
        }
      })
  }
  public onRemoved(event: any) {
    this.actionLog += "\n FileInput: " + event.id;
    this.actionLog += "\n Action: File removed";
    this.fileInfo = "";
    // this.fileName = "";
  }
  public onInvalidDenied(event: any) {
    this.actionLog += "\n FileInput: " + event.id;
    this.actionLog += "\n Action: File denied";
    this.fileInfo = "";
    // this.fileName = "";
  }
  public onCouldNotRemove(event: any) {
    this.actionLog += "\n FileInput: " + event.id;
    this.actionLog += "\n Action: Could not remove file";
  }
  private getFileNames(files: File[]): string {
    let names = files.map(file => file.name);
    return names ? names.join(", ") : "No files currently added.";
  }
}






