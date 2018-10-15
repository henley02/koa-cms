const router = require('koa-router')();
const DB = require('./../../module/db');
const tool = require('./../../module/tool');

//内容管理

router.get('/', async (ctx, next) => {
    try {
        let page = ctx.query.page || 1;
        let pageSize = ctx.query.pageSize || 10;
        let originData = await DB.find('article', {});
        let list = tool.cateToList(originData);
        await ctx.render('admin/article/list', {list: list});
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin'
        });
    }
})

router.get('/add', async (ctx, next) => {
    let list = await DB.find('article', {pid: '0'});
    await ctx.render('admin/article/add', {
        list
    })
})

router.post('/doAdd', async (ctx, next) => {
    let params = ctx.request.body;
    params.add_time = new Date();
    let result = await DB.insert('article', params);
    if (result) {
        ctx.body = {
            code: 1,
            msg: '添加成功',
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '添加失败',
        }
    }
})

router.get('/edit', async (ctx, next) => {
    let _id = ctx.query.id;
    try {
        let result = await DB.find('article', {_id: DB.getObjectId(_id)});
        let list = await DB.find('article', {pid: '0'});
        if (result.length > 0) {
            await ctx.render('admin/article/edit', {
                data: result[0],
                list
            });
        } else {
            await ctx.render('admin/error', {
                message: '分类不存在',
                redirect: ctx.state.__HOST + '/admin/article',
            })
        }
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin/article',
        })
    }
})

router.post('/doEdit', async (ctx, next) => {
    let params = ctx.request.body;
    let _id = DB.getObjectId(params._id);
    delete params._id;
    let result = await DB.update('article', {_id}, params);
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