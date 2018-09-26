const router = require('koa-router')();

const login = require('./admin/login');
const user = require('./admin/user');

router.use(async (ctx, next) => {
    ctx.state.__HOST = 'http://' + ctx.request.header.host;
    //如果登陆了
    if (ctx.session.userInfo || ctx.url === '/admin/login' || ctx.url === '/admin/doLogin') {
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