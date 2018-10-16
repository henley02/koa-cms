const {dbName, dbUrl} = require('./config');
let MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

class DB {
    constructor() {
        this.dbClient = '';
        this.connect();
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.dbClient = client.db(dbName);
                        resolve(this.dbClient);
                    }
                });
            } else {
                resolve(this.dbClient);
            }
        })
    }

    /**
     * 查找数据
     *  DB.find('user',{}) 找出所有的数据
     *  DB.find('user',{},{"title":1})    返回所有数据  只返回一列title
     *  DB.find('user',{},{"title":1},{page:2,pageSize:20}) 返回第二页的数据
     * @param collectionName
     * @param json
     * @param json2
     * @param json3
     * @returns {Promise}
     */
    find(collectionName, json, json2, json3) {
        let attr = {}, slipNum = 0, pageSize = 0;
        if (arguments.length == 3) {
            attr = json2;
        } else if (arguments.length == 4) {
            attr = json2;
            let pageNo = json3.pageNo || 1;
            pageSize = json3.pageSize || 20;
            slipNum = (pageNo - 1) * pageSize;
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionName).find(json, attr).skip(slipNum).limit(pageSize);
                result.toArray((error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                })
            })
        })
    }

    /**
     * 更新数据
     * @param collectionName
     * @param condition
     * @param json
     * @returns {Promise}
     */
    update(collectionName, condition, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(condition, {$set: json}, (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            })
        })
    }

    /**
     * 插入一条数据
     * @param collectionName
     * @param json
     * @returns {Promise}
     */
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        })
    }

    /**
     * 删除一条记录
     * @param collectionName
     * @param json
     * @returns {Promise}
     */
    deleteOne(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).deleteOne(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(result);
                    }
                });
            })
        })
    }

    /**
     * 获取总条数
     * @param collectionName
     * @param json
     * @returns {Promise}
     */
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).countDocuments(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            })
        })
    }

    /**
     * mongodb里面查询 _id 把字符串转换成对象
     * @param id
     * @returns {*}
     */
    getObjectId(id) {
        return new ObjectID(id);
    }
}

module.exports = new DB();