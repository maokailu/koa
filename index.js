const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mapping = require('./config/mapping');
const webpack = require('webpack');
const session = require('koa-session');
const koaBody = require('koa-body');
const os = require('os');
const fs = require('fs');
const app = new Koa();


// 解析表单
app.use(bodyParser());
// 解析路由
app.use(mapping());
// 开发模式下实时编译前端资源
if (process.env.NODE_ENV === 'development') {
    const webpackconfig = require('./webpack.config.js');
    const compiler = webpack(webpackconfig);
    app.use(require('koa-webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackconfig.output.publicPath
    }));
    app.use(require('koa-webpack-hot-middleware')(compiler));
}

app.use(koaBody({ multipart: true }));
// custom 404

app.use(async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/404.html');
});

// 解析静态资源
app.use(serve(path.join(__dirname, 'dist')))

// handle uploads

app.use(async function(ctx, next) {
  // ignore non-POSTs
  if ('POST' != ctx.method) return await next();
  var files=ctx.request.files;

  for(var item in files){
    var tmpath = files[item]['path'];
    var tmparr = files[item]['name'].split('.');
    var ext ='.'+tmparr[tmparr.length-1];
    var newpath =path.join('files/', parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext);
    console.log(tmpath);
    console.log(newpath);
    var stream = fs.createWriteStream(newpath);//创建一个可写流
    fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
  }
});

app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    maxAge: (new Date()).getTime() + 20 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};
app.use(session(CONFIG, app));

app.use(async ctx => {
    // ignore favicon
    if (ctx.path === '/favicon.ico') return;
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    let sessionId = ctx.session.sessionId;
    if(!sessionId || (ctx.session.maxAge < (new Date()).getTime())){
        ctx.session.sessionId = (new Date()).getTime();
        ctx.body = '鉴权失败';
    } else {
        ctx.body = '鉴权成功';
    }
});
app.listen(3000);
