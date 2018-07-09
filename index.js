const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mapping = require('./config/mapping');
const webpack = require('webpack');
const app = new Koa();
// 解析表单
app.use(bodyParser());
app.use(mapping());
const webpackconfig = require('./webpack.config.js');
const compiler = webpack(webpackconfig);
app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackconfig.output.publicPath
}));
app.use(require('koa-webpack-hot-middleware')(compiler));
// 解析静态资源
app.use(serve(path.join(__dirname, 'dist')))

app.listen(3000);
