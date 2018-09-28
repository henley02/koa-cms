const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const sillyDateTime = require('silly-datetime');
const app = new koa();

app.keys = ['321321fafasf'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 60 * 60 * 60 * 30,//cookie的过期时间
    autoCommit: true,
    overwrite: true,
    httpOnly: true,//表示是否可以通过javascript来修改，设成true会更加安全
    signed: true,//默认 签名
    rolling: true,//在每次请求时强行设置 cookie，这将重置 cookie 过期时间
    renew: false,// renew session when session is nearly expired
};

app.use(session(CONFIG, app));
app.use(bodyParser());

render(app, {
        root: path.join(__dirname, 'views'),
        extname: '.html',
        debug: process.env.NODE_ENV !== 'production',
        //格式化日期
        dateFormat: dateFormat = function (value, format = 'YYYY-MM-DD HH:mm') {
            return sillyDateTime.format(new Date(value), format)
        },
    }
)


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