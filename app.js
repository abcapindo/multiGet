const request = require('request');
const fs = require('fs');
const url = require("url");
const path = require("path");

const apiUrl = process.argv[2];

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
    console.log("Starting Download");

    let fileName;
    if (process.argv.indexOf("-f") != -1) {
        fileName = process.argv[process.argv.indexOf("-f") + 1];
    } else {
        fileName = path.basename(url.parse(apiUrl).pathname);
    }

    let numChunks;
    if (process.argv.indexOf("-c") != -1) {
        numChunks = process.argv[process.argv.indexOf("-c") + 1];
    } else {
        numChunks = 4;
    }

    createRanges(numChunks);

    fs.unlink(fileName, function () {
        console.log('Deleted File ' + fileName);
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
        console.log("Finished Download.");
    });
}

main();