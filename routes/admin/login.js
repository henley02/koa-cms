const router = require('koa-router')();
const md5 = require('md5');
const {find} = require('./../../module/db');
router.get('/login', async (ctx, next) => {
    ctx.render('admin/login')
})

router.post('/doLogin', async (ctx, next) => {
    let params = ctx.request.body;
    console.log(params.password);
    console.log(md5(params.password));
    let res = await find('admin', params);
    if (res.length == 0) {
        console.log('没有这个用户');
    } else {
        ctx.session.userInfo = params.username;
        ctx.redirect('/admin/index');
    }
})
module.exports = router.routes();