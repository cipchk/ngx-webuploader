import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { WebUploaderComponent } from './components/webuploader.component';
import { WebUploaderConfig } from './components/webuploader.config';
import { ScriptService } from './components/script.service';

export * from './components/interfaces/options';
export * from './components/interfaces/file';
export { WebUploaderConfig } from './components/webuploader.config';
export { WebUploaderComponent } from './components/webuploader.component';

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
