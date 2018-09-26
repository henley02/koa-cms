const router = require('koa-router')();
const {getMD5} = require('./../../module/tool');
const DB = require('./../../module/db');

router.get('/login', async (ctx, next) => {
    ctx.render('admin/login')
})

router.post('/doLogin', async (ctx, next) => {
    let params = ctx.request.body;
    params.password = getMD5(params.password);
    let res = await DB.find('admin', params);
    if (res.length == 0) {
        console.log('没有这个用户');
    } else {
        ctx.session.userInfo = params.username;
        ctx.redirect('/admin');
    }
})
module.exports = router.routes();