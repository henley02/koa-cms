const md5 = require('md5');
let tools = {
    getMD5(str) {
        return md5(str);
    },
}

module.exports = tools;