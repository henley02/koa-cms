const router = require('koa-router')();
const url = require('url');
const login = require('./admin/login');
const user = require('./admin/user');

router.use(async (ctx, next) => {
    ctx.state.__HOST = 'http://' + ctx.request.header.host;
    ctx.state.GLOBAL = {
        userInfo: ctx.session.userInfo,
    }
    //如果登陆了
    let pathName = url.parse(ctx.url).pathname;//请求路径
    if (ctx.session.userInfo || pathName === '/admin/login' || pathName === '/admin/doLogin' || pathName === '/admin/code') {
        await next();
    } else {
        //没有登陆跳转到登录
        ctx.redirect('/admin/login');
    }
})

router.get('/', async (ctx, next) => {
    await ctx.render('admin/index');
})

router.use(login);
router.use('/user', user);

module.exports = router.routes();