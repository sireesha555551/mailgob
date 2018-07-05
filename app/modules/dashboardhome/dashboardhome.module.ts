import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardhomeComponent} from './dashboardhome.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    Ng2GoogleChartsModule
 ],
  declarations: [DashboardhomeComponent],
  exports: [
    DashboardhomeComponent // <-- this!
  ]
})
export class DashboardhomeModule { }
