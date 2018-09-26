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

    update(collectionName, condition, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionName).updateOne(condition, {$set: json});
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

    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionName).insertOne(json);
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

    deleteOne(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let result = db.collection(collectionName).deleteOne(json);
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

    getObjectId(id) {    /*mongodb里面查询 _id 把字符串转换成对象*/
        return new ObjectID(id);
    }
}

module.exports = new DB();