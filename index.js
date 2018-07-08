const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mapping = require('./config/mapping');
const app = new Koa();
// 解析表单
app.use(bodyParser());
app.use(mapping());
// 解析静态资源
app.use(serve(path.join(__dirname, 'dist')))
app.listen(3000);
