import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import * as moment from 'moment'; 




@Injectable()
export class EditorService {
	private templateSource = new BehaviorSubject<string>("");
	editortype = this.templateSource.asObservable();
	changeTemplate(type: string){
		this.templateSource.next(type)
	}
}