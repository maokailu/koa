import React from 'react';
import { request, debounce } from '../../utils';
import './style.scss';
import {ThemeContext, themes} from '../../components/button/context';
import ThemedButton from '../../components/button';
import ProcessBar from '../../components/process-bar'
let img = new Image();
let isBottom = false;
let page = 0;
export default class Comments extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        comments: [],
        newComment: '',
        nextComments: [],
        theme: themes.light
    }
    static defaultProps = {
        counts: 10
    }
    componentDidMount() {
        this.init();
        window.addEventListener('scroll', debounce(200, this.isBottom));
    }
    init = () => {
        request('queryComments', {page: page, counts: this.props.counts }).then(json => {
            this.setState({
                comments: json
            },()=>{
                request('queryComments', {page: page++, counts: this.props.counts}).then(json => {
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
    getComments = () =>{
        if(this.state.nextComments.length===0) {
            return;
        } else {
            let comments = this.state.comments.concat(this.state.nextComments);
            this.setState({
                comments: comments
            },()=>{
                // 加载完下一屏继续监听
                isBottom = false;
            })
            request('queryComments', {page: page++, counts: this.props.counts}).then(json => {
                this.setState({
                    nextComments: json
                })
            }, error => {
                console.error('出错了', error);
            });
            comments = comments.concat(this.state.nextComments);
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
            // this.init();
          }, error => {
              console.error('出错了', error);
          });
    }
    deleteComment = id =>{
        request('deleteComment', {'id': id}).then(json => {
          }, error => {
              console.error('出错了', error);
          });
        //   this.init();
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
    isBottom = () =>{
        console.log('detect');
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const clientHeight  = document.documentElement.clientHeight ;
        const scrollHeight = document.body.scrollHeight   || document.documentElement.scrollHeight;
        if(!isBottom && (scrollTop + clientHeight >= scrollHeight - 50)){
            console.log("已经到最底部了");
            isBottom = true;
            this.getComments();
    　　}
    }
    toggleTheme = () => {
        this.setState(state => ({
          theme:
            state.theme === themes.dark
              ? themes.light
              : themes.dark,
        }));
    }
    render() {
        return (
            <div>
                <ThemedButton />
                <ThemeContext.Provider value={this.state.theme}>
                    <Toolbar changeTheme={this.toggleTheme} />
                </ThemeContext.Provider>
                {/* <form action="/" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" multiple/>
                    <input type="submit" value="Upload"/>
                </form> */}
                <ProcessBar />
                <div onClick={this.addImg}>查看图片</div>
                <div id="img"></div>
                <div>留言板</div>
                <input className="input-box" onChange={this.inputComments}
                    placeholder={'在这里输入你的留言'} type="text" value={this.state.newComment} />
                <span onClick={this.addComment} className="comfirm-btn">留言</span>
                 <div>
                    {this.state.comments && this.state.comments.map((comment, index) =>
                        <div className="item" key={index}>
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
// 一个使用到ThemedButton组件的中间组件
function Toolbar(props) {
    return (
      <ThemedButton onClick={props.changeTheme}>
        Change Theme
      </ThemedButton>
    );
}