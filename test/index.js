var wreck = require('../lib/index');

wreck.get('https://www.yahoo.com', {}, function () {
	//console.dir(arguments);
});

// profiler.get('http://localhost:8080', {}, function () {
// 	console.dir("arguments");
// });