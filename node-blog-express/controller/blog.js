const xss = require('xss')
const {exec} = require('../db/mysql')
// 请求博客列表
const getList = (author, keyword)=> {
    /* 1=1 是个绝对true条件，保证没有参数传入时不会报错 */
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

// 根据id获取博客
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

// 新增博客
const addNewBlog = (blogData ={}) => {
    // blogData 是博客对象，默认为空对象
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()

    // console.log('title is', title) // title is &lt;script&gt;alert(1)&lt;/script&gt;

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `
    return exec(sql).then(insertData => {
        // console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

// 更新博客
const updateBlog = (id, blogData) => {
    // id 博客的id
    // blogData 是博客对象，默认为空对象
    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `
    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

// 删除博客
const deleteBlog = (id, author) => {
    // id 被删除博客的id
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    addNewBlog,
    updateBlog,
    deleteBlog
}