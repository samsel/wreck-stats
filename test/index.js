var Wreck = require('../index');

var method = 'GET'; // GET, POST, PUT, DELETE
//var uri = 'https://locahost:8081/';
var uri =  'http://www.yahoo.com/';

//var req = Wreck.request(method, uri, {}, function (err, res) {
//    /* handle err if it exists, in which case res will be undefined */
//
//    // buffer the response stream
//    Wreck.read(res, null, function (err, body) {
//        /* do stuff */
//        console.log(body.toString());
//    });
//});

Wreck.get(uri, function (err, res, payload) {
    console.log(arguments);
});

