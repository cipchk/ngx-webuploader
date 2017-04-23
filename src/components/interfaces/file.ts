export enum FileStatus {
    /**
     * 初始状态
     */
    inited,
    /**
     *  已经进入队列, 等待上传
     */
    queued,
    /**
     * 上传中
     */
    progress,
    /**
     * 上传完成。
     */
    complete,
    /**
     * 上传出错，可重试
     */
    error,
    /**
     * 上传中断，可续传。
     */
    interrupt,
    /**
     * 文件不合格，不能重试上传。会自动从队列中移除。
     */
    invalid,
    /**
     * 文件被移除。
     */
    cancelled
}

/**
 * 文件类
 * @class File
 * @constructor 构造函数
 * @grammar new File( source ) => File
 * @param {Lib.File} source [lib.File](#Lib.File)实例, 此source对象是带有Runtime信息的。
 */
export interface File {
    /**
     * 文件名，包括扩展名（后缀）
     * @property name
     * @type {string}
     */
    name?: string;

    /**
     * 文件体积（字节）
     * @property size
     * @type {uint}
     * @default 0
     */
    size?: number;

    /**
     * 文件MIMETYPE类型，与文件类型的对应关系请参考[http://t.cn/z8ZnFny](http://t.cn/z8ZnFny)
     * @property type
     * @type {string}
     * @default 'application/octet-stream'
     */
    type?: string;

    /**
     * 文件最后修改日期
     * @property lastModifiedDate
     * @type {int}
     * @default 当前时间戳
     */
    lastModifiedDate?: number;

    /**
     * 文件ID，每个对象具有唯一ID，与文件名无关
     * @property id
     * @type {string}
     */
    id?: string;

    /**
     * 文件扩展名，通过文件名获取，例如test.png的扩展名为png
     * @property ext
     * @type {string}
     */
    ext?: string;

    /**
     * 状态文字说明。在不同的status语境下有不同的用途。
     * @property statusText
     * @type {string}
     */
    statusText?: string;

    /**
     * 设置状态，状态变化时会触发`change`事件。
     * @method setStatus
     * @grammar setStatus( status[, statusText] );
     * @param {File.Status|String} status [文件状态值](#WebUploader:File:File.Status)
     * @param {String} [statusText=''] 状态说明，常在error时使用，用http, abort,server等来标记是由于什么原因导致文件错误。
     */
    setStatus(status: FileStatus, statusText?: string): void;

    /**
     * 获取文件状态
     * 
     * @returns {FileStatus} 
     */
    getStatus(): FileStatus;

    /**
     * 获取文件原始信息。
     * @return {*}
     */
    getSource(): any;

    /**
     * 销毁 
     */
    destroy(): void;
}
