
// add ejs as view:
var ejs = require('ejs');
var sql = require('../config/db');
const path = require('path');
const os = require('os');
const fs = require('fs');
const fn_index = async (ctx, next) => {
    const path = `./views/index.ejs`;
    const str = require('fs').readFileSync(path, 'utf8');
    const ret = ejs.render(str, {
        filename: path
    });
    ctx.response.body = ret;
};
const queryComments = async (ctx, next) => {
    // const tmp = await sql.query("select * from comments where id >= (? * 10) limit ?", [ctx.request.body.page || 0, ctx.request.body.counts || 1000]).then(function(result) {
    //     return result;
    // });
    const tmp = [
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
        {id: 0, text: 'text'},
    ];
    ctx.response.body = tmp;
};
const addComment = async (ctx, next) => {
    const tmp = await sql.query("insert into comments (text) values (?)", [ctx.request.body.text]).then(function(result) {
        return result;
    });
    ctx.response.body = tmp;
};
const deleteComment = async (ctx, next) => {
    const tmp = await sql.query("delete from comments where id = ?", [ctx.request.body.id]).then(function(result) {
        return result;
    });
    ctx.response.body = tmp;
};
const upload = async (ctx, next) => {
  var files = ctx.request.files;

  for(var item in files){
    var tmpath = files[item]['path'];
    var tmparr = files[item]['name'].split('.');
    var ext ='.'+tmparr[tmparr.length-1];
    var newpath = path.join('files/', parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext);
    var stream = fs.createWriteStream(newpath);//创建一个可写流
    fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
    ctx.response.body = '上传成功';
  }
};

const check = async (ctx, next) => {
    // ignore favicon
    if (ctx.path === '/favicon.ico') return;
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    let sessionId = ctx.session.sessionId;
    if(!sessionId || (ctx.session.maxAge < (new Date()).getTime())){
        ctx.session.sessionId = (new Date()).getTime();
        ctx.response.body = '鉴权失败';
    } else {
        ctx.response.body = '鉴权成功';
    }
};
module.exports = {
    'GET /': fn_index,
    'POST /queryComments': queryComments,
    'POST /addComment': addComment,
    'POST /deleteComment': deleteComment,
    'POST /upload': upload,
    'POST /check': check
};