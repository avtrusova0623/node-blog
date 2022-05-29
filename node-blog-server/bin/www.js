const http = require('http')

const serverHandle = require("../app")
const PORT = 8000

// 创建服务器
const server = http.createServer(serverHandle)
// 监听端口
server.listen(PORT)