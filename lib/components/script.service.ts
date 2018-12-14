import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { WebUploaderConfig } from './webuploader.config';

declare const window: any;

@Injectable()
export class ScriptService {

  private loaded: boolean = false;
  private list: any = {};
  private emitter: Subject<boolean> = new Subject<boolean>();

  constructor(private config: WebUploaderConfig, @Inject(DOCUMENT) private doc: any) {
  }

  getChangeEmitter() {
    return this.emitter;
  }

  load(debug: boolean) {
    if (this.loaded) return this;

    let needJZ: boolean = false;

    // check jquery & zepto
    if (!window.jQuery && !window.Zepto) {
      if (!this.config || !this.config.dependentLib)
        throw new Error(`由于依赖jQuery或Zepto，所以WebUploaderModule.forRoot({})必须指定其中之一路径！
                注：zepto必须含有 [Deferred、Callbacks] 操作符`);
      needJZ = true;
    }

    this.loaded = true;

    let path = this.config && this.config.path;

    if (!path) throw new Error('必须在WebUploaderModule.forRoot({})中指定webUpload脚本路径');

    let root = '' + path;
    // 如果以 `/` 结尾需要截取根路径
    if (path.endsWith('/')) {
      path += debug === true ? 'webuploader.js' : 'webuploader.min.js';
    } else {
      root = path.substr(0, path.lastIndexOf('/')) + '/';
    }

    let promises: Promise<any>[] = [];

    needJZ && promises.push(this.loadScript(this.config.dependentLib));
    promises.push(this.loadCss(`${root}webuploader.css`));
    promises.push(this.loadScript(path));

    Promise.all(promises).then(res => {
      this.emitter.next(true);
    });

    return this;
  }

  loadScript(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.list[path] === true) {
        resolve(<any>{
          path: path,
          loaded: true,
          status: 'Loaded'
        });
        return;
      }

      this.list[path] = true;

      let node = this.doc.createElement('script');
      node.type = 'text/javascript';
      node.src = path;
      node.charset = 'utf-8';
      if (node.readyState) { // IE
        node.onreadystatechange = () => {
          if (node.readyState === "loaded" || node.readyState === "complete") {
            node.onreadystatechange = null;
            resolve(<any>{
              path: path,
              loaded: true,
              status: 'Loaded'
            });
          }
        };
      } else {
        node.onload = () => {
          resolve(<any>{
            path: path,
            loaded: true,
            status: 'Loaded'
          });
        };
      }
      node.onerror = (error: any) => resolve(<any>{
        path: path,
        loaded: false,
        status: 'Loaded'
      });
      this.doc.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  loadCss(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.list[path] === true) {
        resolve(<any>{
          path: path,
          loaded: true,
          status: 'Loaded'
        });
        return;
      }

      this.list[path] = true;

      let node = this.doc.createElement('link');
      node.rel = 'stylesheet';
      node.type = 'text/css';
      node.href = path;
      this.doc.getElementsByTagName('head')[0].appendChild(node);
      resolve(<any>{
        path: path,
        loaded: true,
        status: 'Loaded'
      });
    });
  }
}
