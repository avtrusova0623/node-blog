// 1. 标准输入输出  输入内容回车 打印出内容
// process.stdin.pipe(process.stdout)

// 2. 管道流
// const http = require('http')
// const server = http.createServer((req, res) => {
//     if(req.method === 'POST') {
//         // req的内容流向res
//         req.pipe(res) // 主要语句
//     }
// })
// server.listen(8003)

// 3. 复制文件
// const fs = require('fs')
// const path = require('path')

// // 被复制文件
// const fileName1 = path.resolve(__dirname, 'data.txt')
// // 复制文件
// const fileName2 = path.resolve(__dirname, 'data-copy.txt')

// // 读取流
// const readStream = fs.createReadStream(fileName1)
// // 写入流
// const writeStream = fs.createWriteStream(fileName2)

// // 复制
// readStream.pipe(writeStream)

// // 复制过程
// readStream.on('data', chunk => {
//     console.log(chunk.toString())
// })
// // 复制完成
// readStream.on('end', () => {
//     console.log('copy done')
// })

// 4. 访问服务器读取文件(http://localhost:8003/)
const http = require('http')
const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const server = http.createServer((req, res) => {
    if(req.method === 'GET') {
        const readStream = fs.createReadStream(fileName1)
        readStream.pipe(res)
    }
})
server.listen(8003)
