import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { routes } from './app.router';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { Headers } from '@angular/http';
import { FormBuilder, FormGroup, FormsModule, Form, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterLinkActive } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';



// import our module 
import { HeaderModule } from './modules/header/header.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DashboardhomeModule } from './modules/dashboardhome/dashboardhome.module';
// import {MyCampaignModule} from './modules/mycampaign/mycampaign.module';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { SidenavModule } from './modules/sidenav/sidenav.module';
// import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { MyCampaignComponent } from './modules/mycampaign/mycampaign.component';
// import { DashboardhomeComponent } from './modules/dashboardhome/dashboardhome.component';
import { AddcontactsComponent } from './modules/addcontacts/addcontacts.component';
import { CreateComponent } from './modules/create/create.component';
import { ContactsComponent } from './modules/contacts/contacts.component';
import { ApiformsComponent } from './modules/apiforms/apiforms.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { HelpComponent } from './modules/help/help.component';
import { CreatetemplateComponent } from './modules/createtemplate/createtemplate.component';
import { SidenavComponent } from './modules/sidenav/sidenav.component';
import { DetailedCampaignComponent } from './modules/detailed-campaign/detailed-campaign.component';

//services
import { MyCampaignService } from './modules/mycampaign/mycampaign.service';
import { AddContactsService } from './modules/addcontacts/addcontacts.service';
import { CreateTemplateService } from './modules/createtemplate/createtemplate.service';
import { CommonService } from './modules/common.service';
import { PreviewService } from './modules/preview/preview.service';
import { LoginService } from './modules/login/login.service';
import { EditorService } from './modules/editor.service';
import { AuthService } from './modules/auth.service';
import { AlertsService } from './modules/alerts/alerts.service';
import { SettingsService } from './modules/settings/settings.service';
import { AdminDashboardService } from './modules/admin-dashboard/admin-dashboard.service';
import { DetailedCampaignService } from './modules/detailed-campaign/detailed-campaign.service';





// third party modules
import { UploadModule } from '@progress/kendo-angular-upload';
import { AddcampaignComponent } from './modules/addcampaign/addcampaign.component';
import { ChooseTemplateComponent } from './modules/choose-template/choose-template.component';
import { Ng2PaginationModule } from 'ng2-pagination';
import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2FileInputModule } from 'ng2-file-input'; // <-- import the module
import { MatTooltipModule } from '@angular/material/tooltip';





import { GrapeBuilderComponent } from './modules/grape-builder/grape-builder.component';
import { PreviewComponent } from './modules/preview/preview.component';
import { LoginComponent } from './modules/login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { EditorComponent } from './modules/editor/editor.component';
import { TextEditorComponent } from './modules/text-editor/text-editor.component';
import { UnsubComponent } from './modules/unsub/unsub.component';
import { AlertsComponent } from './modules/alerts/alerts.component';
import { ResetpasswordComponent } from './modules/resetpassword/resetpassword.component';

// TODO: this should go in a shared module. 
import { DomSanitizer } from '@angular/platform-browser';
import { UserVerificationComponent } from './modules/user-verification/user-verification.component';
import { AdminDashboardComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { AdminUserViewComponent } from './modules/admin-user-view/admin-user-view.component';

@Pipe({ name: 'escapeHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value: any, args: any[] = []) {
    // simple JS inj cleanup that should be done on server side primarly
    if (value.indexOf('<script>') != -1) {
      console.log('JS injection. . . html purified');
      return value.replace('<script>', '').replace('<\/script>', '');
    }
    return this.sanitized.bypassSecurityTrustHtml(value); // so ng2 does not remove CSS
  }
}
// End

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    AddcontactsComponent,
    CreateComponent,
    ContactsComponent,
    ApiformsComponent,
    SettingsComponent,
    MyCampaignComponent,
    HelpComponent,
    CreatetemplateComponent,
    AddcampaignComponent,
    ChooseTemplateComponent,
    GrapeBuilderComponent,
    PreviewComponent,
    LoginComponent,
    EditorComponent,
    TextEditorComponent,
    UnsubComponent,
    AlertsComponent,
    EscapeHtmlPipe,
    ResetpasswordComponent,
    UserVerificationComponent,
    DetailedCampaignComponent,
    AdminDashboardComponent,
    AdminUserViewComponent],
  imports: [
    BrowserModule,
    Angular2FontawesomeModule,
    HttpModule,
    RouterModule,
    routes,
    HeaderModule, // import it into our @NgModule block,
    DashboardModule,
    // MyCampaignModule,
    SidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    DashboardhomeModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    UploadModule,
    MatCardModule,
    MatTabsModule,
    MatSelectModule,
    Ng2PaginationModule,
    CKEditorModule,
    MatTooltipModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    Ng2FileInputModule.forRoot(),
  ],

  providers: [
    MyCampaignService,
    AddContactsService,
    CreateTemplateService,
    CommonService,
    PreviewService,
    LoginService,
    CookieService,
    EditorService,
    AuthService,
    AlertsService,
    SettingsService,
    DetailedCampaignService,
    AdminDashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }