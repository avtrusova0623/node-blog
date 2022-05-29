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

// 统一的登录验证函数
const loginVerify = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

// 博客路由
const handleBlogRouter = (req, res) => {
    const method = req.method // get post
    

    // 获取博客列表
    if(method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // 因为getList返回的是异步promise，所以更改代码
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)

        if(req.query.isadmin) {
            // 管理员界面
            const loginVerifyResult = loginVerify(req)
            if (loginVerifyResult) {
                // 未登录
                return loginVerifyResult
            }
            // 强制查询自己的博客
            author = req.session.username
        }

        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }
    // 获取博客详情
    if(method === 'GET' && req.path === '/api/blog/detail') {
        const id = req.query.id
        // const data = getDetail(id)
        // return new SuccessModel(data)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    // 新增博客
    if(method === 'POST' && req.path === '/api/blog/new') {
        // const data = addNewBlog(req.body)
        // return new SuccessModel(data)
        const loginVerifyResult = loginVerify(req)
        if (loginVerifyResult) {
            // 未登录
            return loginVerifyResult
        }

        req.body.author = req.session.username

        const result = addNewBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    // 更新博客
    if(method === 'POST' && req.path === '/api/blog/update') {
        const loginVerifyResult = loginVerify(req)
        if (loginVerifyResult) {
            // 未登录
            return loginVerifyResult
        }

        const id = req.query.id
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if(val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新失败')
            }
        })
        
    }
    // 删除博客
    if(method === 'POST' && req.path === '/api/blog/del') {
        const loginVerifyResult = loginVerify(req)
        if (loginVerifyResult) {
            // 未登录
            return loginVerifyResult
        }

        const author = req.session.username

        const id = req.query.id
        const result = deleteBlog(id, author)
        return result.then(val => {
            if(val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除失败')
            }
        })
        
    }
}

module.exports = handleBlogRouter