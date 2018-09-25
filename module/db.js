const {dbName, dbUrl} = require('./config');
const MongoClient = require('mongodb').MongoClient;


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

    update() {

    }

    insert() {

    }
}

setTimeout(() => {
    var myDB = new DB();
    console.time('start');
    myDB.find('userTest').then((data) => {
        console.log(data);
        console.timeEnd('start');
    })
}, 0)

setTimeout(() => {
    var myDB1 = new DB();
    console.time('start1');
    myDB1.find('userTest').then((data) => {
        console.log(data);
        console.timeEnd('start1');
    })
}, 2000);