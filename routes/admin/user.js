const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    await ctx.render('index')
})

router.get('/add', async (ctx, next) => {
    ctx.body = '增加用户';
})

router.get('/edit', async (ctx, next) => {
    ctx.body = '编辑用户';
})

router.get('/delete', async (ctx, next) => {
    ctx.body = '删除用户';
})

module.exports = router.routes();