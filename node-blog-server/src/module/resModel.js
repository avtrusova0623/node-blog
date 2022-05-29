// 父类
/*
    接受两个参数： data和message
    如果传入的第一个参数就是字符串，把参数赋值给this.message
    这样做既可以传入对象和字符串，也可以只传字符串
*/
class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

// 请求成功数据返回格式
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}
// 请求失败数据返回格式
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}