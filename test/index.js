var Wreck = require('../index');
//var uri = 'http://0.0.0.0:8080/health';
var uri =  'http://www.yahoo.com/';

Wreck.get(uri, function (err, res, payload) {
    console.log(arguments);
});


//var WRECK_TESTS = require('../node_modules/wreck/test/index');