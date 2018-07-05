
// import { MycampaignComponent } from './mycampaign/mycampaign.component';


import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
// import { SidenavComponent } from './modules/sidenav/sidenav.component';
import { AddcontactsComponent } from './modules/addcontacts/addcontacts.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HelpComponent } from './modules/help/help.component';
import { DashboardhomeComponent } from './modules/dashboardhome/dashboardhome.component';
import { ApiformsComponent } from './modules/apiforms/apiforms.component';
import { ContactsComponent } from './modules/contacts/contacts.component';
import { CreatetemplateComponent } from './modules/createtemplate/createtemplate.component';
import { MyCampaignComponent } from './modules/mycampaign/mycampaign.component';
import { AddcampaignComponent } from './modules/addcampaign/addcampaign.component';
import { LoginComponent } from './modules/login/login.component';
import { UnsubComponent } from './modules/unsub/unsub.component';
import { ResetpasswordComponent } from './modules/resetpassword/resetpassword.component';
import { UserVerificationComponent } from './modules/user-verification/user-verification.component';
import { DetailedCampaignComponent } from './modules/detailed-campaign/detailed-campaign.component';
import { AuthService} from './modules/auth.service';
import { AdminDashboardComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { AdminUserViewComponent } from './modules/admin-user-view/admin-user-view.component';


export const router: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },

	{ path: 'login', component: LoginComponent },
	{ path: 'user/resetpassword', component: ResetpasswordComponent },
	{ path: 'user/verification', component: UserVerificationComponent },
	{ path: 'perform/admin/dashboard', component: AdminDashboardComponent},
	{ path: 'perform/admin/userstatistics', component: AdminUserViewComponent},
	// {path:'unsubscribe',redirectTo:'unsubscribe',pathMatch:'full'},
	{ path: 'unsubscribe', component: UnsubComponent },
	{
		path: 'dashboard', component: DashboardComponent,
		children: [
			{ path: '', redirectTo: 'dashboardhome', pathMatch: 'full',canActivate: [AuthService] },
			{ path: 'mycampaigns', component: MyCampaignComponent ,canActivate: [AuthService]},
			{ path: 'dashboardhome', component: DashboardhomeComponent ,canActivate: [AuthService]},
			{ path: 'addcampaign', component: AddcampaignComponent ,canActivate: [AuthService]},
			{ path: 'addcontacts', component: AddcontactsComponent ,canActivate: [AuthService]},
			{ path: 'createtemplate', component: CreatetemplateComponent ,canActivate: [AuthService]},
			{ path: 'contacts', component: ContactsComponent ,canActivate: [AuthService]},
			{ path: 'apiforms', component: ApiformsComponent, canActivate: [AuthService] },
			{ path: 'settings', component: SettingsComponent, canActivate: [AuthService]},
			{ path: 'help', component: HelpComponent, canActivate: [AuthService]},
			{ path: 'campaign', component:DetailedCampaignComponent, canActivate: [AuthService]}
			
		]
	}


]
export const routes: ModuleWithProviders = RouterModule.forRoot(router);