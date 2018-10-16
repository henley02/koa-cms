const fs = require('fs');

/**
 * 判断文件、文件目录是否存在
 * @param name
 * @returns {Promise}
 */
async function isExists(name) {
    return new Promise((resolve, reject) => {
        try {
            fs.exists(name, function (isExists) {
                resolve(isExists);
            });
        } catch (error) {
            reject(error);
        }
    })
}

async function createDir(dir) {
    return new Promise((resolve, reject) => {
        try {
            fs.mkdir(dir, (err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    isExists,
    createDir
}