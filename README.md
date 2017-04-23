# ngx-webuploader
Angular2.x for Baidu WebUploader

[![NPM version](https://img.shields.io/npm/v/ngx-webuploader.svg)](https://www.npmjs.com/package/ngx-webuploader)
[![Build Status](https://travis-ci.org/cipchk/ngx-webuploader.svg?branch=master)](https://travis-ci.org/cipchk/ngx-webuploader)


## Demo

[Live Demo](https://cipchk.github.io/ngx-webuploader/)

## 特性

+ 懒加载 webuploader.js 文件。
+ 使用 WebUploader 实例对象直接访问，这样无须过度额外的学习成本。
+ 支持 Hook。

## 使用

### 1、安装

```
npm install ngx-webuploader --save
```

把 `WebUploaderModule` 模块导入到你项目中。

```typescript
import { WebUploaderModule, WebUploaderConfig, Options, OptionsPick, OptionsThumb } from 'ngx-webuploader';

@NgModule({
    imports: [
        BrowserModule,
        WebUploaderModule.forRoot(<WebUploaderConfig>{
            // 全局默认Options配置
            options: <Options>{
                swf: './assets/webuploader-0.1.5/Uploader.swf',
                server: '/fileupload'
            },
            // webuploader的存储路径
            path: './assets/webuploader-0.1.5/',
            // 依赖库
            dependentLib: './assets/zepto.min.js'
        }
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2、使用

```html
<webuploader 
    [options]="{pick: '#picker'}" 
    [loadingTip]="'加载中……'"
    (onReady)="onReady($event)" 
    (onDestroy)="onDestroy()">
    <div class="wu-example">
        <div id="thelist" class="uploader-list"></div>
        <div class="btns">
            <div id="picker">选择文件</div>
            <button id="ctlBtn" class="btn btn-default">开始上传</button>
        </div>
    </div>
</webuploader>
```

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| options | Options |  | 配置信息，[细节见官网](http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_options) |
| loadingTip | string | 加载中... | 初始化提示文本。 |
| onReady | Function |  | `WebUploader.create` 调用成功后会触发该事件，并会传递 `WebUploaderComponent` 当前实例对象，用于后续操作。 |
| onDestroy | Function |  | **组件销毁**后会触发该事件 |

```typescript
import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { WebUploaderComponent, File, FileStatus } from 'ngx-webuploader';

// 注意：声明$有效
declare const $: any;

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DemoComponent {
    onReady(uploader: WebUploaderComponent) {
        let $list = $('#thelist'),
            state = 'pending',
            $btn = $('#ctlBtn');
        
        // 注意：这里必须使用 uploader.Instance 来表示 WebUpload真实的实例对象。
        // 后续所有操作同官网完全一样，可以参数官网
        uploader.Instance
            // 当有文件添加进来的时候
            .on('fileQueued', (file: File) => {
                $list.append( '<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">等待上传...</p>' +
                '</div>' );
            })
            // 文件上传过程中创建进度条实时显示。
            .on('uploadProgress', (file: File, percentage: number) => {
                let $li = $( '#'+file.id ),
                    $percent = $li.find('.progress .progress-bar');

                // 避免重复创建
                if ( !$percent.length ) {
                    $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                    '</div>' +
                    '</div>').appendTo( $li ).find('.progress-bar');
                }

                $li.find('p.state').text('上传中');

                $percent.css( 'width', percentage * 100 + '%' );
            })
            .on('uploadSuccess', (file: File) => {
                $( '#'+file.id ).find('p.state').text('已上传');
            })
            .on('uploadError', (file: File) => {
                $( '#'+file.id ).find('p.state').text('上传出错');
            })
            .on('uploadComplete', (file: File) => {
                $( '#'+file.id ).find('.progress').hide();
            })
            .on('all', (type: string) => {
                if ( type === 'startUpload' ) {
                    state = 'uploading';
                } else if ( type === 'stopUpload' ) {
                    state = 'paused';
                } else if ( type === 'uploadFinished' ) {
                    state = 'done';
                }

                if ( state === 'uploading' ) {
                    $btn.text('暂停上传');
                } else {
                    $btn.text('开始上传');
                }
            })
        ;

        $btn.on( 'click', () => {
            if ( state === 'uploading' ) {
                uploader.Instance.stop();
            } else {
                uploader.Instance.upload();
            }
        });
    }
    
    onDestroy() {
        console.log('onDestroy');
    }
}    
```

**不建议**使用 `@ViewChild` 来获取 `WebUploaderComponent` 组件实例，原因是当遇到 `*ngIf` 切换时会倒置实例对象丢失。因此，最靠谱的是使用 `onReady` 回传的组件实例来访问 `WebUpload` 实例对象（uploader.Instance）。

### 3、关于懒加载

懒加载在未到 `wdinow.WebUploader` 时会启动，如果你在 `index.html` 已经使用 `<script src="webuploader.js"></script>` 加载过，懒加载流程将会失效。

### 4、依赖库（jQuery&Zepto）

WebUploader依赖第三方类库（jQuery或Zepto），所以这里只能引用如果项目中已经有这二者之一就无法指定。

**Zepto** 默认官网下载是不包括 deferred callbacks，可以通过 http://github.e-sites.nl/zeptobuilder/ 构建一个版本。

### 5、Hook

hook的注册会倒置所有实例都有效（当然也可以在组件的 `options` 设置 `disableWidgets` 来禁用哪些Hook），因此注册最好方式是在 `WebUploaderModule.forRoot()` 中进行，而且这个注册只会生效一次。

**虽然返回的是 Promise 但在定义注册过程中还是不要操作Http之类的，因为这样可能无法保证注册顺序！**

```typescript
WebUploaderModule.forRoot(<WebUploaderConfig>{
    options: <Options>{
        swf: './assets/webuploader-0.1.5/Uploader.swf',
        server: '/fileupload'
    },
    path: './assets/webuploader-0.1.5/',
    dependentLib: './assets/zepto.min.js',
    // hook 接收的是一个Promise对象，有且只有一个 WebUpload 参数。
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
```

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/ngx-webuploader/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/ngx-webuploader/blob/master/LICENSE) file for the full text)
