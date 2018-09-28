const router = require('koa-router')();
const DB = require('./../../module/db');
const {usernameReg, passwordReg} = require('./../../module/config');

router.get('/', async (ctx, next) => {
    let list = await DB.find('admin', {});
    await ctx.render('admin/manage/list', {
        list: list
    });
})

router.get('/add', async (ctx, next) => {
    await ctx.render('admin/manage/add', {usernameReg, passwordReg});
})

router.post('/doAdd', async (ctx, next) => {

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    if (!usernameReg.test(username)) {
        ctx.body = {
            code: -1,
            msg: '请输入6-16位的用户名（数字或者字母）'
        }
    } else if (!passwordReg.test(password)) {
        ctx.body = {
            code: -1,
            msg: '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
        }
    } else {
        console.log(ctx.request.body);
    }
})

router.get('/edit', async (ctx, next) => {
    ctx.body = '编辑用户';
})

router.get('/delete', async (ctx, next) => {
    ctx.body = '删除用户';
})

/**
 * 修改管理员的状态
 */
router.post('/changeStatus', async (ctx, next) => {
    let _id = DB.getObjectId(ctx.request.body.id);
    let data = await DB.find('admin', _id);
    if (data.length > 0) {
        let res = await DB.update('admin', {_id: _id}, {status: data[0].status === 1 ? 0 : 1});
        if (res.result.ok === 1) {
            ctx.body = {
                code: 1,
                msg: '修改管理员状态成功',
                data: '',
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '修改管理员状态失败',
                data: '',
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '管理员不存在',
            data: '',
        }
    }
})
module.exports = router.routes();