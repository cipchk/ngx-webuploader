import { WebUploaderConfig } from './webuploader.config';
import { Options } from './interfaces/options';
import { Component, Input, forwardRef, ViewChild, ElementRef, OnDestroy, EventEmitter, Output, NgZone } from '@angular/core';

import { ScriptService } from './script.service';

declare const window: any;
declare const WebUploader: any;

@Component({
    selector: 'webuploader',
    template: `<div [hidden]="loading"><ng-content></ng-content></div><p class="webuploader-loading" [hidden]="!loading">{{loadingTip}}</p>`
})
export class WebUploaderComponent implements OnDestroy {
    private instance: any;
    private DEF: Options;
    loading: boolean = true;
    @Input() loadingTip: string = '加载中...';

    @Input() options: Options;

    @Output() onReady = new EventEmitter<WebUploaderComponent>();
    @Output() onDestroy = new EventEmitter();

    constructor(private el: ElementRef,
                private zone: NgZone, 
                private ss: ScriptService,
                private config: WebUploaderConfig) { 
        this.DEF = config && config.options || {};
    }

    ngOnInit() {
        this.loading = true;
        // 已经存在对象无须进入懒加载模式
        if (window.WebUploader) {
            this.init();
            return;
        }

        this.ss.load(true).getChangeEmitter().subscribe(res => {
            this.init();
        });
    }

    private init(options?: any) {
        this.loading = false;

        if (!window.WebUploader)
            throw new Error('webuploader js文件加载失败');

        if (this.instance) return;

        // registrer hook
        if (this.config && this.config.hook) {
            if (!this.config._hook_finished) {
                this.config._hook_finished = true;
                this.config.hook(WebUploader);
            }
        }
        const opt = Object.assign({}, this.DEF, this.options, options);
        this.instance = WebUploader.create(opt);
        this.onReady.emit(this);
    }

    private destroy() {
        if (this.instance) {
            this.instance.destroy();
            this.instance = null;
        }
        this.onDestroy.emit();
    }

    /**
     * 获取Webupload实例
     * 
     * @readonly
     */
    get Instance(): any {
        return this.instance;
    }

    ngOnDestroy() {
        this.destroy();
    }
}
