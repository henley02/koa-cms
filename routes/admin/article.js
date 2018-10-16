const router = require('koa-router')();
const DB = require('./../../module/db');
const multer = require('koa-multer');// 文件上传
const path = require('path');
const {isExists, createDir} = require('./../../module/file');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let dir = path.resolve(__dirname, '../../public/uploads/');
        let isExist = await isExists(dir);
        if (!isExist) {
            await createDir(dir);
        }
        cb(null, dir);// 配置上传文件的目录
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split('.');//获取后缀名
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});
const upload = multer({storage: storage});

//内容管理
router.get('/', async (ctx, next) => {
    try {
        let page = ctx.query.page || 1;
        let pageSize = ctx.query.pageSize || 10;
        let list = await DB.find('user', {}, {}, {pageNo: page, pageSize: parseInt(pageSize)});
        let count = await DB.count('user', {});
        let totalPages = Math.ceil(count / pageSize);
        await ctx.render('admin/article/list', {list: list, totalPages: totalPages, currentPage: page});
    } catch (error) {
        await ctx.render('admin/error', {
            message: '系统异常' + error,
            redirect: ctx.state.__HOST + '/admin'
        });
    }
})

router.get('/add', async (ctx, next) => {
    await ctx.render('admin/article/add');
})

router.post('/doAdd', upload.single('pic'), async (ctx, next) => {
    let params = ctx.request.body;
    console.log(ctx.req.file);
    params.add_time = new Date();
    console.log(params);
    ctx.body = {
        filename: ctx.req.file ? ctx.req.file.filename : '',
        body: ctx.req.body
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