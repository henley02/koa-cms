const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    ctx.body = '登录';
})

module.exports = router.routes();