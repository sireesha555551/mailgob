import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { Routes, RouterModule } from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [DashboardComponent],
  exports: [
    DashboardComponent // <-- this!
  ],
  providers:[DashboardService]
})
export class DashboardModule { }
