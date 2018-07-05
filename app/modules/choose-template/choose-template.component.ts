import { Component, OnInit } from '@angular/core';
import {EditorService} from '../editor.service';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.scss']
})
export class ChooseTemplateComponent implements OnInit {
	isHtml: boolean = false;
	isRichText: string = "";
	isDrapDrop: string = "";
  constructor(
  	private editorService: EditorService) { }

  ngOnInit() {
  }
  onDragButtonClick($event){
  	this.isDrapDrop = "drag"
  	// sending to global scope and change the module
  	this.editorService.changeTemplate(this.isDrapDrop);
  }
  onRichtextButtonClick($event){
    this.isRichText = "rich-text"
    this.editorService.changeTemplate(this.isRichText);
  }

}
