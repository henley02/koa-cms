const router = require('koa-router')();
const login = require('./admin/login');
const user = require('./admin/user');

router.get('/', async (ctx, next) => {
    ctx.body = '后台管理';
})

router.use('/login', login);

router.use('/user', user);

module.exports = router.routes();