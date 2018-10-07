const router = require('koa-router')();
const DB = require('./../../module/db');
const tool = require('./../../module/tool');

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

router.post('/remove', async (ctx, next) => {
    let _id = ctx.request.body.id;
    try {
        let result = await DB.deleteOne('articlecate', {_id: DB.getObjectId(_id)});
        if (result) {
            ctx.body = {
                code: 1,
                msg: '删除成功'
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '删除失败'
            }
        }
    } catch (error) {
        ctx.body = {
            code: -1,
            msg: '删除失败'
        }
    }
})
router.post('/changeStatus', async (ctx, next) => {
    let _id = DB.getObjectId(ctx.request.body.id);
    let data = await DB.find('articlecate', _id);
    if (data.length > 0) {
        let res = await DB.update('articlecate', {_id: _id}, {status: data[0].status === 1 ? 0 : 1});
        if (res.result.ok === 1) {
            ctx.body = {
                code: 1,
                msg: '修改分类状态成功',
                data: '',
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '修改分类状态失败',
                data: '',
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '分类不存在',
            data: '',
        }
    }
})
module.exports = router.routes();