import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl, AbstractControl } from '@angular/forms';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertsService } from '../alerts/alerts.service';
import { RecaptchaComponent } from 'ng-recaptcha';



@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginFormGroup: FormGroup;
	userSignupGroup: FormGroup;
	countries: any = [];
	selected: string;
	isChecked: boolean = false;
	error_alerts = [];
	success_alerts = [];
	captcha: any = "";
	userEmail: any;
	display:any = 'none';
	isLoginError: boolean = true;
	isRobotError: boolean = false;
	exp = /(\w(=?@)\w+\.{1}[a-zA-Z]{2,})/i;
	selectedIndex: any = 0;
	resendEMail: any;
	message: any = "I am freedom fighter";
	isEmailVerified: boolean = false;

	@ViewChild('recaptchaRef')
	recaptchaRef: RecaptchaComponent;

	@ViewChild('recaptchaRef2')
	recaptchaRef2: RecaptchaComponent;

//password matching
	static MatchPassword(AC: AbstractControl) {
		let password = AC.get('password').value; // to get value in input tag
		let confirm_password = AC.get('confirm_password').value; // to get value in input tag
		 if(password != confirm_password) {
			 AC.get('confirm_password').setErrors( {MatchPassword: true} )
		 } else {
			 return null
		 }
	 }

	constructor(
		private _formBuilder: FormBuilder,
		private loginService: LoginService,
		private cookieService: CookieService,
		private commonService: CommonService,
		private router: Router,
		private authService: AuthService,
		private alertsService: AlertsService,
		private activatedRoute: ActivatedRoute) { }
	ngOnInit() {
		this.alertsClear();
		if (this.cookieService.get('token')) {
			this.router.navigate(['dashboard/dashboardhome']);
		}
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.commonService.makeTawkHide();
			let a = params['val'];
			if (a == "log") {
				this.selectedIndex = 1;
				if(params['ver'] == "true"){
					this.alertsService.changeAlert({ value: true });
					this.alertsService.changeAlertsMessage({ type: 'success', message: "Congratulations!. You have successfully verified email.Please login to continue", time:15000 });
				}
			} else {
				this.selectedIndex = 0;
			}
		})

		this.loginService.getCountries()
			.subscribe(resp => {
				// this.countries = resp;
				var dataObj = {}
				for (let key in resp.message) {
					let value = resp.message[key];
					dataObj["id"] = key;
					dataObj["name"] = value;
					this.countries.push(dataObj);
					dataObj = {};
				}
			})
		this.loginFormGroup = this._formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.userSignupGroup = this._formBuilder.group({
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			// country: ['', Validators.required],
			email: ['', Validators.required],
			company_name: [''],
			contact_number: [''],
			password:new FormControl('', Validators.minLength(5)),
			confirm_password:new FormControl ('', Validators.required)

		},
		{
			validator:LoginComponent.MatchPassword
		})
	}
	selectTab(index: number): void {
		this.selectedIndex = index;
	}
	onLoginClick(formData: NgForm) {
		let data = formData.value;
		this.isLoginError = true;
		var captchaData = this.captcha;
		if (!formData.valid) {
			this.alertsService.changeAlert({ value: true });
			this.alertsService.changeAlertsMessage({ type: 'error', message: "Username/Password are incorrect", time: 5000 });
		} else {
			this.recaptchaRef.reset();
			if (captchaData && this.exp.test(data.email)) {
				this.resendEMail = data.email;
				this.loginService.userLoginCheck(data)
					.subscribe(resp => {
						if (resp.status) {
							data.token = resp.data.token;
							data.userinfo = resp.data.user_info;
							data.time = new Date();
							// this.authService.getUserBasicInformation(data.token);
							this.commonService.setUserData(data);
							this.commonService.changeUser('user');
							this.router.navigate(["dashboard/dashboardhome"]);
						} else {
							//throw login error
							if(resp.error_code == 501){
								this.router.navigate(['user/verification'], { queryParams: { isLog: 'true', email: this.resendEMail} });
								// this.message = resp.message;
								// console.log(resp.message);
								// this.display = 'block';
							}else{
								this.alertsService.changeAlert({ value: true });
								this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message, time: 5000 });
							}
						}
					})
			} else {
				window.scrollTo(0, 0);
				if (!captchaData) {
					this.isRobotError = true;
					setTimeout(() => {    //<<<---    using ()=> syntax
						this.isRobotError = false;
					}, 2000);


				} else {
					this.alertsService.changeAlert({value: true});
					this.alertsService.changeAlertsMessage({type: 'error' , message: 'Please enter a valid email/password.', time: 5000});
				}
			}
		}
	}

	onSignupClick(formData: NgForm) {
		this.error_alerts = [];
		this.success_alerts = [];
		this.isLoginError = false;
		var myCaptcha = this.captcha;
		var isPasswordMatch: any;
		let data = formData.value;
		data.country_id = this.selected;
		if ((data.password != "") && (data.password === data.confirm_password)) {
			isPasswordMatch = true;
		} else {
			isPasswordMatch = false;
		}
		if (this.isChecked && this.selected && isPasswordMatch && formData.valid && this.isEmailVerified && myCaptcha) {
			this.loginService.userRegisterCheck(data)
				.subscribe(resp => {
					if (resp.status) {
						this.resendEMail = data.email;
						// show success message
						window.scrollTo(0, 0);
						this.userSignupGroup.reset()
						this.selected = "";
						this.isChecked = false;
						formData.resetForm();
						this.recaptchaRef2.reset();
						// open modal to show resend password link 
						this.router.navigate(['user/verification'], { queryParams: { isLog: 'false', email: this.resendEMail} });

						// this.message = "Account created successfully, " +  
						// "Email sent to your inbox Please click on the verification link to get it activated and get started!";
						// this.display = "block";
					} else {
						window.scrollTo(0, 0);
						// eror message
						this.alertsService.changeAlert({ value: true });
						this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message , time: 5000});
						this.recaptchaRef2.reset();

					}
				})
		} else {
			// this.userSign!upGroup.reset();
			this.userSignupGroup.setErrors(null);
			if (!formData.valid) {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Please fill all mandatory fields first." , time: 5000});
			}
			else if (this.selected == "") {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Please choose country", time: 5000 });
			}
			else if (!this.isEmailVerified) {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Please enter a proper email", time: 5000 });
			}
			else if (!this.isChecked) {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Please Accept the terms" , time: 5000});
			}
			else if (!isPasswordMatch) {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Password mis-match ", time: 5000 });
			}
			else if (!this.captcha) {
				this.alertsService.changeAlert({ value: true });
				this.alertsService.changeAlertsMessage({ type: 'error', message: "Please confirm that you are not a robot", time: 5000 });
			}
			// this.isChecked = false;
			window.scrollTo(0, 0);
			this.recaptchaRef2.reset();

		}
	}
	onChange(isChecked: boolean) {
		if (isChecked) {
			this.isChecked = true;
		} else {
			this.isChecked = false;
		}
	}
	removeAlert(alert) {
		this.success_alerts = [];
		this.error_alerts = [];
	}
	public resolved(captchaResponse: string) {
		this.captcha = captchaResponse;
	}
	onFogotPasswordClick($event) {
		var email = this.userEmail;
		this.isLoginError = false;
		if (email && this.exp.test(email)) {
			this.loginService.sendForgotPasswordMail(email)
				.subscribe(resp => {
					if (resp.status) {
						this.alertsService.changeAlert({ value: true });
						this.alertsService.changeAlertsMessage({ type: 'success', message: resp.message, time: 5000 });
						//throw alert & close modal
						this.userEmail = "";
					} else {
						//show error
						this.alertsService.changeAlert({ value: true });
						this.alertsService.changeAlertsMessage({ type: 'error', message: resp.message, time: 5000 });

					}
				})
		} else {
			//throw alert error
			this.alertsService.changeAlert({ value: true });
			this.alertsService.changeAlertsMessage({ type: 'error', message: "Enter a valid email" , time: 5000});
		}
	}
	alertsClear() {
		this.alertsService.changeAlert({ value: false });
	};
	onCloseHandled(){
  	this.display='none'; 
 		this.message = "";
  }
  // onresendLink($event){
  // 	this.authService.resendVerifyLink(this.resendEMail)
  // 	.subscribe(resp => {
  // 		if(resp.status){
  // 			this.alertsService.changeAlert({ value: true });
		// 		this.alertsService.changeAlertsMessage({ type: 'success', message: "Verification link sent successfully.Please check your email.", time: 4000 })
  // 		}
  // 	})
  // }

  // email exist api integration for email check
  checkEmailValue(email){
  	if(email.length){
  		this.authService.verifyEmailFromEmailExist(email)
  		.subscribe(resp => {
  			if(resp.status){
  				this.isEmailVerified = true;
  			}else{
  				this.isEmailVerified = false;
  			}
  		})
  	}
  }

}
