const request = require('request');
const fs = require('fs');
const url = require("url");
const path = require("path");

const apiUrl = process.argv[2];
let numChunks = process.argv[3] != undefined ? process.argv[3] : 4;

const promises = [];
const ranges = [];

/**
 * Creates string ranges of 1 MB for number of given chunks. Used in http calls.
 * @param {number} numChunks 
 */
function createRanges(numChunks) {
    let start = 0;
    let end = 1048575;
    for (let i = 0; i < numChunks; i++) {
        ranges.push(start + '-' + end);
        start += 1048576;
        end += 1048576;
    }
}

/**
 * Creates http call.
 * @param {String Array} range 
 */
function promise(range) {
    console.log('Creating Promise: ' + range);
    var options = {
        uri: apiUrl,
        encoding: null,
        headers: {
            'Range': 'bytes=' + range,
            'Accept-Encoding': 'gzip, deflate'
        }
    }
    return new Promise(function (resolve, reject) {
        request.get(options, function (err, resp, body) {
            console.log('Promise' + resp.headers['content-range']);
            if (err) {
                reject(err);
            } else {
                resolve(Buffer.from(body));
            }
        });
    });
}

/**
 * Runs application
 */
function main() {
    const fileName = path.basename(url.parse(apiUrl).pathname);
    createRanges(numChunks);

    fs.unlink(fileName, function () {
        console.log('Deleted File');
    })

    ranges.forEach(function (element) {
        promises.push(promise(element));
    });

    Promise.all(promises).then(function (values) {
        values.forEach(function (data) {
            fs.appendFileSync(fileName, data, 'binary', function (err) {
                if (err) throw err;
            });
        });
    });
}

function test() {
    const options = {
        uri: apiUrl,
        headers: {
            'Range': 'bytes=0-4194303',
            'Accept-Encoding': 'gzip, deflate'
        },
        encoding: null
    };

    request.get(options, function (err, resp, body) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile('./nani.jar', body, 'binary', function (err) {
                if (err) throw err;
                console.log('Done');
            })
        }
    });
}

main();