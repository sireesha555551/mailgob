import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import {EditorService} from '../editor.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
	public isDirective:boolean =  false;
	isDrag: boolean = false;
	isRichText: boolean = false;
	@Output() stepperEvent = new EventEmitter<string>();
	constructor(
		private editorService: EditorService) { }

	ngOnInit() {
		this.isDirective = false;
		this.editorService.editortype.subscribe(message => 
			{
				if(message == "drag"){
				this.isRichText = false;
				this.isDirective = true;
				this.isDrag = true;
				}else if(message == "cancel"){
					this.isDirective = false;
					this.isDrag = false;
					this.isRichText = false;
				}
				else if(message == "rich-text"){
					this.isDrag = false;
					this.isDirective = true;
					this.isRichText = true;
				}else if(message = ""){
					this.isDrag = false;
					this.isRichText = false;
					this.isDirective = false;
				}
		});
	}
	stepperChange($event){
		this.stepperEvent.emit('next');
	}

}
