
// add ejs as view:
var ejs = require('ejs');
var sql = require('../config/db');

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

module.exports = {
    'GET /': fn_index,
    'POST /queryComments': queryComments,
    'POST /addComment': addComment,
    'POST /deleteComment': deleteComment,
};