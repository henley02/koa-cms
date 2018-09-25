const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const app = new koa();

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

const admin = require('./routes/admin');
const index = require('./routes/index');
const api = require('./routes/api');

router.use('/admin', admin);
router.use('/api', api);
router.use(index);

app.use(static(__dirname + '/public'));//静态资源

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);