const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')

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

// session数据
// const SESSION_DATA = {}

// 用于处理 post请求发送的 data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
		// req.on(data)指每次发送的数据；req.on(end)数据发送完成；
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

// 服务器回调
const serverHandle = (req, res) => {
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // 设置数据返回格式  json格式
    res.setHeader('Content-type', 'application/json')

    // 获取 path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析请求参数
    query = new URLSearchParams(url.split('?')[1])
    req.query = {}
    query.forEach((value,key)=> {
        req.query[key] = value
    })

    // 解析cookie(以下代码只是解析一下，登录验证测试用并无实际意义)
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;...
    cookieStr.split(';').forEach(item => {
        if(!item) {
          return 
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key] = value
    })
    // console.log(req.cookie)

    // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if(userId) {
    //     if(!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }

    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // 在处理路由之前，先解析请求参数（post or get）
        return getPostData(req)
    })
    .then(postData => {
        // body之前是空的
        req.body = postData

        // 处理blog博客路由
        /*
        const blogData = handleBlogRouter(req, res)
        if(blogData) {
            res.end(
                JSON.stringify(blogData)
            )
            return 
        }
        */
       const blogResult = handleBlogRouter(req, res)
       if(blogResult) {
           blogResult.then(blogData => {
              if(needSetCookie) {
                  res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
              }
              res.end(
                  JSON.stringify(blogData)
              )
           })
           return
       }
    
        // 处理user路由
        /*
        const userData = handleUserRouter(req, res)
        if(userData) {
            res.end(
                JSON.stringify(userData)
            )
            return 
        }
        */
        const userResult = handleUserRouter(req, res)
        if(userResult) {
            userResult.then(userData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                ) 
            })
            return 
        }
    
        // 无匹配路由 返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })

}

// 暴露方法
module.exports = serverHandle

// env:process.env.NODE_ENV