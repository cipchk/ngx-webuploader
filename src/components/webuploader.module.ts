import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { WebUploaderComponent } from './webuploader.component';
import { WebUploaderConfig } from './webuploader.config';
import { ScriptService } from './script.service';

@NgModule({
  imports: [ CommonModule ],
  providers: [ ScriptService ],
  declarations: [WebUploaderComponent],
  exports: [WebUploaderComponent]
})
export class WebUploaderModule {
    static forRoot(config: WebUploaderConfig): ModuleWithProviders {
        return {
            ngModule: WebUploaderModule,
            providers: [
                { provide: WebUploaderConfig, useValue: config }
            ]
        };
    }
}
