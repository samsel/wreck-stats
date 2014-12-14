var Wreck = require('../lib/index');

var method = 'GET'; // GET, POST, PUT, DELETE
//var uri = 'https://locahost:8081/';
var uri =  'https://www.google.com/';

var options = {};

var optionalCallback = function (err, res) {

    /* handle err if it exists, in which case res will be undefined */

    // buffer the response stream
    Wreck.read(res, null, function (err, body) {
        /* do stuff */
        console.log(body.toString());
    });
};

var req = Wreck.request(method, uri, options, optionalCallback);