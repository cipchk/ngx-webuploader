import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HighlightJsModule } from 'ngx-highlight-js';
import { TabsModule } from 'ngx-bootstrap';

import { WebUploaderModule, WebUploaderConfig, Options } from 'ngx-webuploader';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HighlightJsModule,
    TabsModule.forRoot(),

    WebUploaderModule.forRoot(<WebUploaderConfig>{
      options: <Options>{
        swf: './assets/webuploader-0.1.5/Uploader.swf',
        server: '/fileupload'
      },
      path: './assets/webuploader-0.1.5/',
      dependentLib: './assets/zepto.min.js',
      hook(webUploader: any): Promise<any> {
        return new Promise<any>(resolve => {
          webUploader.Uploader.register({
            'add-file': 'addFiles'
          }, {
              addFiles: (files: File[]) => {
                console.log('from hook', files)
              }
            });
        });
      }
    })
  ],
  declarations: [
    AppComponent,
    DemoComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppDemoModule {
}
