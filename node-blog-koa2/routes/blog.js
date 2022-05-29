const router = require('koa-router')()

// 导入数据请求方法
const { 
  getList, 
  getDetail,
  addNewBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog')
// 导入返回数据模型
const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginVerify = require('../middleware/loginVerify')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  
  if (ctx.query.isadmin) {
      console.log('is admin')
      // 管理员界面
      if (ctx.session.username == null) {
          console.error('is admin, but no login')
          // 未登录
          ctx.body = new ErrorModel('未登录')
          return
      }
      // 强制查询自己的博客
      author = ctx.session.username
  }
  
  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

// 详情
router.get('/detail', async function (ctx, next) {
  const id = ctx.query.id
  const data = await getDetail(id)
  ctx.body = new SuccessModel(data)
});

// 新建
router.post('/new', loginVerify, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await addNewBlog(body)
  ctx.body = new SuccessModel(data)
});

// 更新
router.post('/update', loginVerify, async function (ctx, next) {
      const id = ctx.query.id
      const val = await updateBlog(id, ctx.request.body)
      if(val) {
          ctx.body = new SuccessModel()
      } else {
        ctx.body = new ErrorModel('更新博客失败')
      }
      
});

// 删除
router.post('/del', loginVerify, async function (ctx, next) {
  const author = ctx.session.username
  const id = ctx.query.id
  const val = await deleteBlog(id, author)
  if(val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
  
});


module.exports = router
