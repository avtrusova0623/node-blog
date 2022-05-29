// 导入返回数据模型
const {SuccessModel, ErrorModel} = require('../model/resModel')
// 导入登录方法
const {loginCheck} = require('../controller/user')

const { set } = require('../db/redis')

// 设置cookie的有效时间
const setCookieExpires = () => {
    // 当前时间
    const d = new Date()
    // 当前时间加1天
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // d.toGMTString() 一种时间格式
    console.log('d.toGMTString() is', d.toGMTString());
    return d.toGMTString()
}

// 登录路由
const handleUserRouter = (req, res) => {
    const method = req.method // get post

    // 登录
    if(method === 'POST' && req.path === '/api/user/login') {
        const {username, password} = req.body
        // const {username, password} = req.query
        const result = loginCheck(username, password)

        return result.then(data => {
            // console.log(data);
            if(data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname

                // 同步到 redis
                set(req.sessionId, req.session)

                return new SuccessModel()
            }
            
            return new ErrorModel('登录失败')
        })
        
    }

    // 登录验证测试（cookie中有username就能登录）
    // if(method === 'GET' && req.path === '/api/user/login-test') {
    //     if(req.session.username) {
    //         return Promise.resolve(
    //             new SuccessModel({
    //                 session: req.session
    //             })
    //         )
    //     }
    //     return Promise.resolve(
    //         new ErrorModel('登录失败')
    //     )
    // }
}

module.exports = handleUserRouter