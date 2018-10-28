const requestPromise = require('request-promise');
const url = 'http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar';
const arg = process.argv[2];

const ranges = ['0-1023', '1024-2047', '2048-3071', '3072-4095'];
let data;
let compare;
let count = 1;

function promise(range) {
    var options = {
        uri: arg,
        headers: {
            'Range': 'bytes=' + range
        }
    }

    requestPromise(options)
        .then(function (resp) {
            data += resp;
            console.log(count);
            count += 1;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function fourMB() {
    var options = {
        uri: arg,
        headers: {
            'Range': 'bytes=0-4095'
        }
    }
    requestPromise(options)
        .then(function (resp) {
            compare += resp;
        })
        .catch(function (err) {
            console.log(err);
        });
}

const promises = [];

ranges.forEach(function (element) {
    promises.push(promise(element));
});

promises.push(fourMB);

Promise.all(promises).then(function () {
    console.log(data == compare);
});

console.log(arg);