import React from 'react';
import { request } from '../utils';
import './style.scss';
var img = new Image();
export default class Comments extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        comments: [],
        newComment: '',
        nextComments: []
    }
    componentDidMount() {
        this.getComments();
    }
    getComments = () =>{
        if(this.state.nextComments.length!==0) {
            let comments = this.state.comments.concat(this.state.nextComments);
            this.setState({
                comments: comments
            })
            request('queryComments').then(json => {
                this.setState({
                    nextComments: json
                })
            }, error => {
                console.error('出错了', error);
            });
            comments = comments.concat(this.state.nextComments);
        } else {
            request('queryComments').then(json => {
                this.setState({
                    comments: json
                },()=>{
                    request('queryComments').then(json => {
                        this.setState({
                            nextComments: json
                        })
                    });
                    this.proLoadImg();
                })
            }, error => {
                console.error('出错了', error);
            });
        }
    }
    inputComments = event => {
        this.setState({
            newComment: event.target.value
        })
    }
    addComment = () =>{
        request('addComment', {'text': this.state.newComment}).then(json => {
            this.setState({
                newComment: ''
            })
            this.init();
          }, error => {
              console.error('出错了', error);
          });
    }
    deleteComment = id =>{
        request('deleteComment', {'id': id}).then(json => {
          }, error => {
              console.error('出错了', error);
          });
          this.init();
    }
    getMore =() =>{
    }
    proLoadImg = () => {
        if (document.images) {
            img.src = '/triplogo.png';
        }
    }
    addImg = () =>{
        const div = document.getElementById('img');
        div.appendChild(img);
    }
    render() {
        return (
            <div>
                <div onClick={this.addImg}>查看图片</div>
                <div id="img"></div>
                <div>留言板</div>
                <input className="input-box" onChange={this.inputComments}
                    placeholder={'在这里输入你的留言'} type="text" value={this.state.newComment} />
                <span onClick={this.addComment} className="comfirm-btn">留言</span>
                 <div>
                    {this.state.comments && this.state.comments.map((comment, index) =>
                        <div className="item">
                            <span>{comment.text}</span>
                            <span onClick={()=>this.deleteComment(comment.id)} className="comfirm-btn">删除</span>
                        </div>
                    )}
                 </div>
                 <span onClick={this.getComments}>加载更多</span>
                 {/* 改成滚动到底部 */}
            </div>
       );
    }
}
