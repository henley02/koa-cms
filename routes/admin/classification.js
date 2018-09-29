const router = require('koa-router')();
const DB = require('./../../module/db');

router.get('/', async (ctx, next) => {
    try {
        let list = await DB.find('articlecate', {});
        await ctx.render('admin/classification/list', {list: list});
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin'
        });
    }
})

router.get('/add', async (ctx, next) => {
    await ctx.render('admin/classification/add')
})

module.exports = router.routes();