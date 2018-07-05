import { Component, OnInit } from '@angular/core';
import {CommonService} from '../common.service';
import {Router,ActivatedRoute,Params} from '@angular/router';


@Component({
  selector: 'app-unsub',
  templateUrl: './unsub.component.html',
  styleUrls: ['./unsub.component.scss']
})
export class UnsubComponent implements OnInit {

  constructor(
  	private commonService: CommonService,
  	private activatedRoute: ActivatedRoute) { }
	textValue: any;
	obj:any={
		id: "",
		comment: ""
	}
	isUnsubscribed: boolean = false;
  ngOnInit() {
  }
  onUnsubscribe($event, text){
  	this.activatedRoute.queryParams.subscribe((params: Params) => {
  		this.obj.id = params['id'];
  		this.obj.comment = text;
  	})
  	this.commonService.doUnsubscribe(this.obj).
  	subscribe(resp =>{
  		if(resp.status){
  			alert('Unsubscribed Successfully');
  			this.isUnsubscribed = true;
  		}else{
  			alert('Falied');
  		}
  	})
  }

}
