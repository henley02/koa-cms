const config = {
    dbUrl: 'mongodb://localhost:27017',//数据库地址
    dbName: 'test',//数据库名称
    usernameReg: /^[a-zA-Z0-9]{6,16}$/, // 用户名正则 6-16位的字母或者字母
    passwordReg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/ //密码正则 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
}

module.exports = config;