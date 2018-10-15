const router = require('koa-router')();
const svgCaptcha = require('svg-captcha');
const {getMD5} = require('./../../module/tool');
const DB = require('./../../module/db');

/**
 * 打开后台首页
 */
router.get('/', async (ctx, next) => {
    await ctx.render('admin/index')
})

router.post('/changeStatus', async (ctx, next) => {
    let _id = DB.getObjectId(ctx.request.body.id);
    let collectionName = ctx.request.body.collectionName;
    let attr = ctx.request.body.attr;
    let data = await DB.find(collectionName, _id);
    if (data.length > 0) {
        let res = await DB.update(collectionName, {_id: _id}, {status: data[0][attr] === 1 ? 0 : 1});
        if (res.result.ok === 1) {
            ctx.body = {
                code: 1,
                msg: '修改成功',
                data: '',
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '修改失败',
                data: '',
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: 'ID不存在',
            data: '',
        }
    }
})

router.post('/remove', async (ctx, next) => {
    let _id = ctx.request.body.id;
    let collectionName = ctx.request.body.collectionName;
    try {
        let result = await DB.deleteOne(collectionName, {_id: DB.getObjectId(_id)});
        console.log(result);
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

module.exports = router.routes();