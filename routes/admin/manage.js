const router = require('koa-router')();
const md5 = require('md5');
const DB = require('./../../module/db');
const {usernameReg, passwordReg} = require('./../../module/config');

router.get('/', async (ctx, next) => {
    let list = await DB.find('admin', {});
    await ctx.render('admin/manage/list', {
        list: list
    });
})

router.get('/add', async (ctx, next) => {
    await ctx.render('admin/manage/add');
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
        let data = await DB.find('admin', {username: username});
        if (data.length > 0) {
            ctx.body = {
                code: -1,
                msg: '用户名已经存在，请换个用户名',
            }
        } else {
            let result = await DB.insert('admin', {
                username: username,
                password: md5(password),
                status: 1,
                last_time: ''
            });
            if (result) {
                ctx.body = {
                    code: 1,
                    msg: '添加用户成功',
                }
            } else {
                ctx.body = {
                    code: -1,
                    msg: '添加用户失败',
                }
            }
        }
    }
})

router.get('/edit', async (ctx, next) => {
    let _id = ctx.query.id;
    try {
        let result = await DB.find('admin', {_id: DB.getObjectId(_id)});
        if (result.length > 0) {
            await ctx.render('admin/manage/edit', {
                data: result[0]
            });
        } else {
            await ctx.render('admin/error', {
                message: '用户不存在',
                redirect: ctx.state.__HOST + '/admin/manage',
            })
        }
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin/manage',
        })
    }
})

router.post('/doEdit', async (ctx, next) => {
    let _id = ctx.request.body._id;
    console.log(_id);
    let password = ctx.request.body.password;
    if (!passwordReg.test(password)) {
        ctx.body = {
            code: -1,
            msg: '密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
        }
    } else {
        try {
            let result = await DB.update('admin', {_id: DB.getObjectId(_id)}, {password: md5(password)});
            if (result) {
                ctx.body = {
                    code: 1,
                    msg: '修改密码成功'
                }
            } else {
                ctx.body = {
                    code: -1,
                    msg: '修改密码失败'
                }
            }
        } catch (error) {
            ctx.body = {
                code: -1,
                msg: '系统异常' + error
            }
        }
    }
})

router.post('/remove', async (ctx, next) => {
    let _id = ctx.request.body.id;
    console.log(_id)
    try {
        let result = await DB.deleteOne('admin', {_id: DB.getObjectId(_id)});
        console.log(result);
        if (result) {
            ctx.body = {
                code: 1,
                msg: '修改密码成功'
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