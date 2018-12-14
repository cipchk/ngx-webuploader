import { ElementRef } from '@angular/core';
/**
 * 同WebUploader `options`
 * see http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_options
 */
export interface Options {
  /**
   * swf文件路径
   */
  swf?: string;

  /**
   * 文件接收服务端
   */
  server?: string;

  /**
   *  [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
   */
  dnd?: string;

  /**
   * [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
   */
  disableGlobalDnd?: boolean;

  /**
   * [可选] [默认值：undefined] 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
   */
  paste?: any;

  /**
   * [可选] [默认值：undefined] 指定选择文件的按钮容器，不指定则不创建按钮。
   */
  pick?: string | OptionsPick;

  /**
   * [可选] [默认值：null] 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
   */
  accept?: OptionsAccept | OptionsAccept[];

  /**
   * [可选] 配置生成缩略图的选项。
   */
  thumb?: OptionsThumb;

  /**
   *  [可选] 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。
   */
  compress?: OptionsCompress;

  /**
   * [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
   */
  auto?: boolean;

  /**
   * @property [runtimeOrder=html5,flash]
   * @description 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.
   *
   * 可以将此值设置成 `flash`，来强制使用 flash 运行时。
   */
  runtimeOrder?: 'html5,flash' | 'html5' | 'flash';

  /**
   * 是否允许在文件传输时提前把下一个文件准备好。
   * 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。
   * 如果能提前在当前文件传输期处理，可以节省总体耗时。
   */
  prepareNextFile?: boolean;

  /**
   * 是否要分片处理大文件上传。
   */
  chunked?: boolean;

  /**
   * 如果要分片，分多大一片？ 默认大小为5M.
   */
  chunkSize?: number;

  /**
   * 如果某个分片由于网络问题出错，允许自动重传多少次？
   */
  chunkRetry?: number;

  /**
   * 上传并发数。允许同时最大上传进程数。
   */
  threads?: number;

  /**
   * 文件上传请求的参数表，每次发送都会发送此对象中的参数。
   */
  formData?: any;

  /**
   * 设置文件上传域的name
   */
  fileVal?: string;

  /**
   * 文件上传方式
   */
  method?: 'POST' | 'GET';

  /**
   * 是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中。
   */
  sendAsBinary?: boolean;

  /**
   * 验证文件总数量, 超出则不允许加入队列。
   */
  fileNumLimit?: number;

  /**
   * 验证文件总大小是否超出限制, 超出则不允许加入队列。
   */
  fileSizeLimit?: number;

  /**
   * 验证单个文件大小是否超出限制, 超出则不允许加入队列。
   */
  fileSingleSizeLimit?: number;

  /**
   * 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
   */
  duplicate?: boolean;

  /**
   * 默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。
事件说明
   */
  disableWidgets?: string | string[];
}

/**
 * 按钮容器
 */
export interface OptionsPick {
  /**
   * 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
   */
  id?: string | ElementRef;

  /**
   * 请采用 innerHTML 代替
   */
  label?: string;

  /**
   * 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
   */
  innerHTML?: string;

  /**
   * 是否开起同时选择多个文件能力。
   */
  multiple?: boolean;
}

/**
 * 指定接受哪些类型的文件
 */
export interface OptionsAccept {
  /**
   * 文字描述
   */
  title?: string;

  /**
   * 允许的文件后缀，不带点，多个用逗号分割。
   */
  extensions?: string;

  /**
   * 多个用逗号分割。
   */
  mimeTypes?: string;
}

/**
 * 配置生成缩略图
 */
export interface OptionsThumb {
  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 图片质量
   */
  quality?: number;

  /**
   * 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
   */
  allowMagnify?: boolean;

  /**
   * 是否允许裁剪。
   */
  crop?: boolean;

  /**
   * 图片类型
   * 为空的话则保留原有图片格式。
   * 否则强制转换成指定的类型。
   */
  type?: string;
}

/**
 * 配置压缩
 */
export interface OptionsCompress {
  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 图片质量
   */
  quality?: number;

  /**
   * 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
   */
  allowMagnify?: boolean;

  /**
   * 是否允许裁剪。
   */
  crop?: boolean;

  /**
   * 是否保留头部meta信息
   */
  preserveHeaders?: boolean;

  /**
   * 如果发现压缩后文件大小比原来还大，则使用原来图片
   * 此属性可能会影响图片自动纠正功能
   */
  noCompressIfLarger?: boolean;

  /**
   * 单位字节，如果图片大小小于此值，不会采用压缩。
   */
  compressSize?: number;
}
