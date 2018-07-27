import React from 'react';
import './style.scss';
export default class ProgressBar extends React.Component {
    constructor() {
        super();
        this.state = {
            showArea: true,
            process: 0,
            showFileName: false,
            showImg: false
        };
    }
    componentDidMount() {
        this.previewFiles([]);
    }
    readFileSize = file => {
        let size = file.size / 1024;
        const aMultiples = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let fileSizeString = '';
        for (let i = 0; size > 1; size /= 1024, i++) {
            fileSizeString = size.toFixed(2) + ' ' + aMultiples[i];
        }
        return fileSizeString;
    };
    dragEnter = e => {
        e.stopPropagation();
        e.preventDefault();
    };
    dragOver = e => {
        e.stopPropagation();
        e.preventDefault();
    };
    drop = e => {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;
        this.previewFiles(files);
    };
    previewFiles = files => {
        if (!files) return;
        const localFiles = localStorage.getItem(files);
        if (localFiles) {
          files = localFiles.contact(files);
        }
        localStorage.setItem('files', files);
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            const imageType = /^image\//;

            if (this.state.showArea) {
                this.setState({
                    showArea: false
                });
            }
            // 展示标题
            if (!imageType.test(file.type)) {
                this.setState({
                    process: 0,
                    showImg: false,
                    showFileName: true,
                    fileName: file.name
                })
                continue;
            }
            
            // 填充选择的图片到展示区
            this.setState({
                process: 0,
                showFileName: false,
                showImg: true
            }, ()=>{
                const imgBox = document.getElementById('img');
                const img = document.createElement('img');
                img.classList.add('obj');
                img.file = file;
                imgBox.appendChild(img);
                // 读取File对象中的内容
                const reader = new FileReader();
                reader.onload = (function(aImg) {
                    return function(e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            });
        }
    };
    filesInput = e => {
        const files = e.target.files;
        this.readFileSize(files);
        this.previewFiles(files);
    };
    upload = () => {
        const file = document.getElementById('fileInput').files[0];
        var url = '/';
        var form = new FormData();
        form.append('file', file);
        if (file) {
            const reader = new FileReader();
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = event => {
                // progress进度条
                if (event.lengthComputable) {
                    var percent = Math.floor(event.loaded / event.total * 100) ;
                    console.log('percentage:' + percent);
                    this.setState({
                        process: percent
                    })

                }
            };
            xhr.onload = e => {
                if (xhr.status === 200) {
                　　console.log('上传成功');
                    } else {
                    　console.log('上传出错');
                }
            };
            xhr.open('POST', '/');
            xhr.send(form);
        }
    };
    render() {
        const anim = {
            width: this.state.process * 2 + 'px',
            transition: 'width 0s'
        }
        return (
            <div>
                <div className="filePicker">
                    <label htmlFor="fileInput">点击选择文件</label>
                    <input
                        id="fileInput"
                        type="file"
                        name="file"
                        onChange={this.filesInput}
                    />
                </div>
                <div
                    id="dropbox"
                    className="dropbox"
                    onDragEnter={e => this.dragEnter(e)}
                    onDragOver={e => this.dragOver(e)}
                    onDrop={e => this.drop(e)}
                >
                    {this.state.showArea && <div className="area" />}
                    <div id="preview">
                        {this.state.showFileName && <div>{this.state.fileName}</div>}
                        {this.state.showImg && <div id="img"></div>}
                        <span>{'已上传:'+this.state.process}</span>
                        <div className="process-bar-back">
                            <div className="process-bar" style={anim}></div>
                        </div>
                    </div>
                </div>
                <div className="upload" onClick={this.upload}>
                    点击上传
                </div>
            </div>
        );
    }
}