import { Component, OnInit ,Input} from '@angular/core';
declare var grapesjs: any; // Important!
import {CommonService} from '../common.service';

@Component({
  selector: 'app-grape-builder',
  templateUrl: './grape-builder.component.html',
  styleUrls: ['./grape-builder.component.scss']
})
export class GrapeBuilderComponent implements OnInit {

  message: any = grapesjs;
  constructor(
    private commonService: CommonService) { }
  ngOnInit() {
    this.commonService.html.subscribe(message => {
      var html: any = message;
      if(html){
        html = html.toString().split('<body>')[1];
        var editor = grapesjs.init({
        plugins: ['gjs-preset-newsletter'],
        pluginsOpts: {
          'gjs-preset-newsletter': {
            modalTitleImport: 'Import template',
            // ... other options
          }
        },
        container : '#gjs'
      });
        editor.on('load', function(){
        editor.BlockManager.getAll().reset();

          // editor.setComponents('<h1>HTML Ipsum Presents</h1><p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p><h2>Header Level 2</h2><ol> <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ol><blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote><h3>Header Level 3</h3><ul> <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ul>')
          // html = html.toString().split('</body>')[0];
          editor.setComponents(html);
          editor.UndoManager.clear();
        });
        // console.log(this.html)
      }else{
        html = ""
        var editor = grapesjs.init({
          plugins: ['gjs-preset-newsletter'],
          pluginsOpts: {
            'gjs-preset-newsletter': {
              modalTitleImport: 'Import template',
              // ... other options
            }
          },
          container : '#gjs'
        });
          editor.on('load', function(){
          // editor.BlockManager.getAll().reset();

            // editor.setComponents('<h1>HTML Ipsum Presents</h1><p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p><h2>Header Level 2</h2><ol> <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ol><blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote><h3>Header Level 3</h3><ul> <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ul>')
            // html = html.toString().split('</body>')[0];
            editor.setComponents("");
            // editor.UndoManager.clear();
          });
      }
      // this.message = editor;
    })

  }



}
