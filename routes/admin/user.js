const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    await ctx.render('admin/user/list');
})

router.get('/add', async (ctx, next) => {
    await ctx.render('admin/user/add');
})

router.get('/edit', async (ctx, next) => {
    ctx.body = '编辑用户';
})

router.get('/delete', async (ctx, next) => {
    ctx.body = '删除用户';
})

module.exports = router.routes();