const router = require('koa-router')();
const svgCaptcha = require('svg-captcha');
const {getMD5} = require('./../../module/tool');
const DB = require('./../../module/db');

/**
 * 打开登录
 */
router.get('/login', async (ctx, next) => {
    ctx.render('admin/login')
})

/**
 * 执行登录
 */
router.post('/doLogin', async (ctx, next) => {
    let params = ctx.request.body;
    if (params.code.toLowerCase() !== ctx.session.captcha.toLowerCase()) {//验证 验证码
        ctx.body = {
            code: -1,
            msg: '验证码不对',
        };
        return false;
    }
    params.password = getMD5(params.password);
    let res = await DB.find('admin', {username: params.username, password: params.password});
    if (res.length == 0) {
        ctx.body = {
            code: -1,
            msg: '没有这个用户或者密码错误',
        }
    } else {
        ctx.session.userInfo = res[0];
        //更新用户表 改变用户登录的时间
        await DB.update('admin', {
            username: params.username,
            password: params.password
        }, {'last_time': new Date()});
        ctx.body = {
            code: 1,
            msg: '登录成功',
        }
    }
})

router.get('/logout', async (ctx, next) => {
    ctx.session.userInfo = null
    ctx.redirect('/admin/login');
})
/**
 * 获取图形验证码
 */
router.get('/code', async (ctx, next) => {
    let captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: "#cc9966"
    })
    ctx.session.captcha = captcha.text; // session 存储
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
})

module.exports = router.routes();