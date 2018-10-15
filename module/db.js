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
     * @param collectionName 集合名
     * @param json 条件
     * @returns {Promise}
     */
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionName).find(json);
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
     * mongodb里面查询 _id 把字符串转换成对象
     * @param id
     * @returns {*}
     */
    getObjectId(id) {
        return new ObjectID(id);
    }
}

module.exports = new DB();