const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

// 读取文件内容
fs.readFile(fileName, (err, data) => {
    if(err) {
        console.error(err)
        return 
    }

    // data是二进制buffer，需要转换为字符串
    console.log(data.toString())
})


// 写入文件
const content = '这是新写入的内容\n'
const opt = {
    // 写入方式
    flag: 'a' // 追加写入， 覆盖用 w
}
fs.writeFile(fileName, content, opt, (err) => {
    if(err) {
        console.error(err)
    }
})

// 判断文件是否存在
// 在调用 fs.open()、fs.readFile() 或 fs.writeFile() 之前
// 不要使用 fs.access() 或fs.stat()检查文件的可访问性
fs.access(fileName, fs.constants.F_OK, (err) => {
    console.log(`${fileName} ${err ? 'does not exist' : 'exists'}`)
})
fs.access(fileName + '1', fs.constants.F_OK, (err) => {
    console.log(`${fileName + '1'} ${err ? 'does not exist' : 'exists'}`)
})

