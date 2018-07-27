const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const mapping = require('./config/mapping');
const webpack = require('webpack');
const session = require('koa-session');
const koaBody = require('koa-body');
const app = new Koa();


// 解析表单
app.use(koaBody({ multipart: true }));
// session
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

// 解析静态资源
app.use(serve(path.join(__dirname, 'dist')))

app.listen(3000);
