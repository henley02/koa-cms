const md5 = require('md5');

let tools = {
    getMD5(str) {
        return md5(str);
    },
    cateToList(data) {
        //1、一级分类
        let fistArr = [];
        data.forEach(item => {
            if (item.pid == 0) {
                fistArr.push(item);
            }
        })

        //2、二级分类
        fistArr.forEach(item=>{
            item.list=[];
            data.forEach(it => {
                if ((item._id) == it.pid) {
                    item.list.push(it);
                }
            })
        })
        return fistArr;
    }
}

module.exports = tools;