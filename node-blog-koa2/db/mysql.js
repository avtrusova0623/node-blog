const mysql = require('mysql')
const {MYSQL_CONF} = require('../conf/db')

// 1. 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 2. 开始连接
con.connect()

// 3. 统一执行SQL的函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    // 返回promise
    return promise
}

module.exports = {
    exec,
    escape: mysql.escape
}