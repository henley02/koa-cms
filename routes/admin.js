const router = require('koa-router')();
const ueditor = require('koa2-ueditor');
const url = require('url');

const index = require('./admin/index');
const login = require('./admin/login');
const user = require('./admin/user');
const manage = require('./admin/manage');
const classification = require('./admin/classification');
const article = require('./admin/article');

//富文本图片上传地址 ueditor.config.js 配置图片post地址
router.all('/editorUpload', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

router.use(async (ctx, next) => {
    ctx.state.__HOST = 'http://' + ctx.request.header.host;
    let pathName = url.parse(ctx.url).pathname;//请求路径
    ctx.state.GLOBAL = {
        url: pathName.substring(1).split("/"),//左侧菜单选中
        userInfo: ctx.session.userInfo,
        prevPage: ctx.request.headers['referer']//上一页的地址
    }

    //如果登陆了
    if (ctx.session.userInfo || pathName === '/admin/login' || pathName === '/admin/doLogin' || pathName === '/admin/code') {
        await next();
    } else {
        //没有登陆跳转到登录
        ctx.redirect('/admin/login');
    }
})

router.use(index);
router.use(login);
router.use('/user', user);
router.use('/manage', manage);
router.use('/classification', classification);
router.use('/article', article);

module.exports = router.routes();