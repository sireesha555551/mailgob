import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Router,ActivatedRoute,Params} from '@angular/router';
declare var fby : any;




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  display: any = 'none';
  constructor(
    private router: Router) { }

  ngOnInit() {
    this.getFeedbackModule();
  }
  onClickFeedback($event){
    fby = fby || [];
    fby.push(['showForm', '13536']);
  }
  onCloseHandled(){
  	this.display='none'; 
  }
  getFeedbackModule(){
    var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
    f.src = '//cdn.feedbackify.com/f.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
  }

  onDashBoardClick($event){
    this.router.navigate(["dashboard/dashboardhome"]);
  }
}
