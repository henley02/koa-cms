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

module.exports = router.routes();