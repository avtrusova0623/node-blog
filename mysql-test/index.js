// 1. 引入mysql
const mysql = require('mysql')

// 2. 创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tara1314',
    port: 3306,
    database: 'myblog'
})

// 3. 开始连接数据库
con.connect()

// 4. 执行sql语句
const sql = `insert into blogs (title,content,createtime,author) values ('js作用域','很重要',1651327955965,'lisi')`
con.query(sql, (err, result) => {
    if(err) {
        console.error(err)
        return 
    }
    console.log(result)
})

// 5. 关闭连接
con.end()