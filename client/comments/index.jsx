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
        currentIndex: -1,
        currentText: ''
    }
    componentDidMount() {
        request('queryComments').then(json => {
          this.setState({
              comments: json
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
          }, error => {
              console.error('出错了', error);
          });
    }
    deleteComment = () =>{
        request('deleteComment', {'id': 0}).then(json => {
          }, error => {
              console.error('出错了', error);
          });
    }
    updateComment = index =>{
        console.log(this.state.comments[index])
        this.setState({
            currentIndex: index
        })
    }
    editComment = event =>{
        this.setState({
            currentText: event.target.value
        })
    }
    render() {
        return (
            <div>
                <div>留言板</div>
                <input className="input-box" onChange={this.inputComments}
                    placeholder={'在这里输入你的留言'} type="text" value={this.state.newComment} />
                <span onClick={this.addComment}>留言</span>
                 <div>
                    {this.state.comments && this.state.comments.map((comment, index) =>
                        <div>
                            <span onChange={this.editComment} contenteditable={index === this.state.currentIndex}>{(this.state.currentText && (index === this.state.currentIndex)) ? this.state.currentText : comment.text}</span>
                            <span onClick={this.deleteComment}>删除</span>
                            <span onClick={()=>this.updateComment(index)}>修改</span>
                        </div>
                    )}
                 </div>
            </div>
       );
    }
}
