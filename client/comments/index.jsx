import React from 'react';
import { request } from '../utils';
import './style.scss';
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
        this.init();
    }
    init = () =>{
        request('queryComments').then(json => {
            this.setState({
                comments: json
            },()=>{
                request('queryComments').then(json => {
                    this.setState({
                        nextComments: json
                    })
                })
            })
        }, error => {
            console.error('出错了', error);
        });
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
        const comments = this.state.comments.concat(this.state.nextComments);
        this.setState({
            comments: comments
        })
    }
    render() {
        return (
            <div>
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
                 <span onClick={this.getMore}>加载更多</span>
                 {/* 改成滚动到底部 */}
            </div>
       );
    }
}
