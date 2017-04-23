import { Options } from './interfaces/options';

export class WebUploaderConfig {
    /**
     * 默认配置项
     * 
     * @type {Options}
     */
    options?: Options;

    /**
     * 指定webupload.js路径
     * 
     * @type {string}
     */
    path?: string;

    /**
     * webupload依赖时jQuery或zepto
     * 如果项目中已经有二者之一无须指定，否则需要指定一个jquery或zepto的路径
     * 注：zepto必须含有 [Deferred] 操作符
     * 
     * @type {string}
     */
    dependentLib?: string;

    /**
     * 自定义Hook
     * 
     * @type {Promise<any>}
     */
    hook(webUploader: any): Promise<any> {
        return Promise.resolve(null);
    };

    // 用于标记hook是否已经注册完成
    _hook_finished: boolean = false;
}
