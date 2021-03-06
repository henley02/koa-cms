const router = require('koa-router')();
const DB = require('./../../module/db');
const tool = require('./../../module/tool');

//分类管理

router.get('/', async (ctx, next) => {
    try {
        let originData = await DB.find('articlecate', {});
        let list = tool.cateToList(originData);
        await ctx.render('admin/classification/list', {list: list});
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin'
        });
    }
})

router.get('/add', async (ctx, next) => {
    let list = await DB.find('articlecate', {pid: '0'});
    await ctx.render('admin/classification/add', {
        list
    })
})

router.post('/doAdd', async (ctx, next) => {
    let params = ctx.request.body;
    params.add_time = new Date();
    let result = await DB.insert('articlecate', params);
    if (result) {
        ctx.body = {
            code: 1,
            msg: '添加分类成功',
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '添加分类失败',
        }
    }
})

router.get('/edit', async (ctx, next) => {
    let _id = ctx.query.id;
    try {
        let result = await DB.find('articlecate', {_id: DB.getObjectId(_id)});
        let list = await DB.find('articlecate', {pid: '0'});
        if (result.length > 0) {
            await ctx.render('admin/classification/edit', {
                data: result[0],
                list
            });
        } else {
            await ctx.render('admin/error', {
                message: '分类不存在',
                redirect: ctx.state.__HOST + '/admin/classification',
            })
        }
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin/classification',
        })
    }
})

router.post('/doEdit', async (ctx, next) => {
    let params = ctx.request.body;
    let _id = DB.getObjectId(params._id);
    delete params._id;
    let result = await DB.update('articlecate', {_id}, params);
    if (result) {
        ctx.body = {
            code: 1,
            msg: '更新分类成功',
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '更新分类失败',
        }
    }
})
module.exports = router.routes();