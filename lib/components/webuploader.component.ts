import { Component, Input, OnDestroy, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { WebUploaderConfig } from './webuploader.config';
import { Options } from './interfaces/options';
import { ScriptService } from './script.service';

declare const window: any;
declare const WebUploader: any;

@Component({
  selector: 'webuploader',
  template: `<div [hidden]="loading"><ng-content></ng-content></div><p class="webuploader-loading" [hidden]="!loading">{{loadingTip}}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebUploaderComponent implements OnDestroy {
  private instance: any;
  private DEF: Options;
  loading: boolean = true;

  @Input() loadingTip: string = '加载中...';
  @Input() options: Options;

  @Output() readonly onReady = new EventEmitter<WebUploaderComponent>();
  @Output() readonly onDestroy = new EventEmitter();

  constructor(
    private ss: ScriptService,
    private config: WebUploaderConfig,
    private cd: ChangeDetectorRef
  ) {
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
    this.cd.detectChanges();

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

  /**
   * 获取Webupload实例
   */
  get Instance(): any {
    return this.instance;
  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
    this.onDestroy.emit();
  }
}
