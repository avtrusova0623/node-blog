var express = require('express');
var router = express.Router();
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

// 列表
router.get('/list', (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    
    if (req.query.isadmin) {
        console.log('is admin')
        // 管理员界面
        if (req.session.username == null) {
            console.error('is admin, but no login')
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的博客
        author = req.session.username
    }
    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

// 详情
router.get('/detail', (req, res, next) => {
    const id = req.query.id
    const result = getDetail(id)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
});

// 新建
router.post('/new', loginVerify, (req, res, next) => {
    req.body.author = req.session.username
    const result = addNewBlog(req.body)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
});

// 更新
router.post('/update', loginVerify, (req, res, next) => {
        const id = req.query.id
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if(val) {
                res.json(new SuccessModel())
            } else {
                res.json(new ErrorModel('更新失败'))
            }
        })
});

// 删除
router.post('/del', loginVerify, (req, res, next) => {
    const author = req.session.username
    const id = req.query.id
    const result = deleteBlog(id, author)
    return result.then(val => {
        if(val) {
            res.json(new SuccessModel())
        } else {
            res.json(new ErrorModel('删除失败'))
        }
    })
});

  
module.exports = router;