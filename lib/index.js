'use strict';

var Wreck = require('wreck');

module.exports = Wreck;
return;

var _Wreck = {
	request: function () {
		var _wreck = Wreck.request.apply(this, arguments);
		return decorate(_wreck);
	},
	get: function () {
		var _wreck = Wreck.get.apply(this, arguments);
		return decorate(_wreck);		
	},
	post: function () {
		var _wreck = Wreck.post.apply(this, arguments);
		return decorate(_wreck);			
	},
	put: function () {
		var _wreck = Wreck.put.apply(this, arguments);
		return decorate(_wreck);		
	},
	delete: function () {
		var _wreck = Wreck.delete.apply(this, arguments);
		return decorate(_wreck);			
	}			
};

function decorate(_wreck) {
	var start = process.hrtime();
	_wreck.on('socket', function () {
		var end = process.hrtime(start);
		var ms = end[0] * 1e3 + end[1] * 1e-6
        var val = ms.toFixed(3)
        val += 'ms'
		console.log(val);
	});

	return _wreck;
}

module.exports = Object.create(Wreck, {
	request: {
		value: _Wreck.request,
		writable: false,
		enumerable: true,
		configurable: false
	},
	get: {
		value: _Wreck.get,
		writable: false,
		enumerable: true,
		configurable: false
	},
	post: {
		value: _Wreck.post,
		writable: false,
		enumerable: true,
		configurable: false
	},
	put: {
		value: _Wreck.put,
		writable: false,
		enumerable: true,
		configurable: false
	},
	delete: {
		value: _Wreck.delete,
		writable: false,
		enumerable: true,
		configurable: false
	}				
});