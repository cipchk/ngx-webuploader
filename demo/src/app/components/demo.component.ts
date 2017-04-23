/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { WebUploaderComponent, File, FileStatus, Options, OptionsAccept } from 'ngx-webuploader';

declare const $: any;
declare const window: any;

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DemoComponent {
    constructor(private el: ElementRef) { }

    switchStatus: boolean = true;

    onReady(uploader: WebUploaderComponent) {
        let $list = $('#thelist'),
            state = 'pending',
            $btn = $('#ctlBtn');
            
        uploader.Instance
            // 当有文件添加进来的时候
            .on('fileQueued', (file: File) => {
                $list.append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">等待上传...</p>' +
                    '</div>');
            })
            // 文件上传过程中创建进度条实时显示。
            .on('uploadProgress', (file: File, percentage: number) => {
                let $li = $('#' + file.id),
                    $percent = $li.find('.progress .progress-bar');

                // 避免重复创建
                if (!$percent.length) {
                    $percent = $('<div class="progress progress-striped active">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div>' +
                        '</div>').appendTo($li).find('.progress-bar');
                }

                $li.find('p.state').text('上传中');

                $percent.css('width', percentage * 100 + '%');
            })
            .on('uploadSuccess', (file: File) => {
                $('#' + file.id).find('p.state').text('已上传');
            })
            .on('uploadError', (file: File) => {
                $('#' + file.id).find('p.state').text('上传出错');
            })
            .on('uploadComplete', (file: File) => {
                $('#' + file.id).find('.progress').hide();
            })
            .on('all', (type: string) => {
                if (type === 'startUpload') {
                    state = 'uploading';
                } else if (type === 'stopUpload') {
                    state = 'paused';
                } else if (type === 'uploadFinished') {
                    state = 'done';
                }

                if (state === 'uploading') {
                    $btn.text('暂停上传');
                } else {
                    $btn.text('开始上传');
                }
            })
            ;

        $btn.on('click', () => {
            if (state === 'uploading') {
                uploader.Instance.stop();
            } else {
                uploader.Instance.upload();
            }
        });
    }

    onDestroy() {
        console.log('onDestroy');
    }

    imgOptions: Options = <Options>{
        // 自动上传。
        auto: true,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择文件，可选。
        accept: <OptionsAccept>{
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    };

    onImgReady(uploader: WebUploaderComponent) {

        let $list = $('#fileList'),
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            thumbnailWidth = 100 * ratio,
            thumbnailHeight = 100 * ratio;

        // 当有文件添加进来的时候
        uploader.Instance.on('fileQueued', function (file) {
            var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
            ),
                $img = $li.find('img');

            $list.append($li);

            // 创建缩略图
            uploader.Instance.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, thumbnailWidth, thumbnailHeight);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.Instance.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.Instance.on('uploadSuccess', function (file) {
            $('#' + file.id).addClass('upload-state-done');
        });

        // 文件上传失败，现实上传出错。
        uploader.Instance.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.Instance.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });
    }

    onImgDestroy() {
        console.log('onDestroy');
    }

    hookOptions: Options = {
        // 自动上传。
        auto: true,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#hookFilePicker',
        // 只允许选择文件，可选。
        accept: <OptionsAccept>{
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    };

    onHookReady(uploader: WebUploaderComponent) {
        let $list = $('#hookFileList'),
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            thumbnailWidth = 100 * ratio,
            thumbnailHeight = 100 * ratio;

        // 当有文件添加进来的时候
        uploader.Instance.on('fileQueued', function (file) {
            var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
            ),
                $img = $li.find('img');

            $list.append($li);

            // 创建缩略图
            uploader.Instance.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, thumbnailWidth, thumbnailHeight);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.Instance.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.Instance.on('uploadSuccess', function (file) {
            $('#' + file.id).addClass('upload-state-done');
        });

        // 文件上传失败，现实上传出错。
        uploader.Instance.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.Instance.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });
    }

    onHookDestroy() {
        console.log('onDestroy');
    }
}
