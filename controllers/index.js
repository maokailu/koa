
// add ejs as view:
var ejs = require('ejs');
var sql = require('../config/db');

var fn_index = async (ctx, next) => {
    var path = `./views/index.ejs`;
    var str = require('fs').readFileSync(path, 'utf8');
    var ret = ejs.render(str, {
        filename: path
    });
    ctx.response.body = ret;
};
var queryComments = async (ctx, next) => {
    var tmp = await sql.query("select * from comments;", []).then(function(result) {
        return result;
    });
    ctx.response.body = tmp;
};
var addComment = async (ctx, next) => {
    var tmp = await sql.query("insert into comments (text) values (?)", [ctx.request.body.text]).then(function(result) {
        return result;
    });
    ctx.response.body = tmp;
};
var deleteComment = async (ctx, next) => {
    var tmp = await sql.query("delete from comments where id = ?", [ctx.request.body.id]).then(function(result) {
        return result;
    });
    ctx.response.body = tmp;
};
module.exports = {
    'GET /': fn_index,
    'POST /queryComments': queryComments,
    'POST /addComment': addComment,
    'POST /deleteComment': deleteComment,
};