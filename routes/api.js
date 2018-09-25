const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    ctx.body = 'api';
})

module.exports = router.routes();