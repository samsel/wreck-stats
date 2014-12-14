'use strict';

var Wreck = require('wreck');
var applyToDefaults = require('hoek').applyToDefaults;

var props = {
	writable: false,
	enumerable: true,
	configurable: false
};

var _Wreck = {
	// follow Wreck's request method signature
	// https://github.com/hapijs/wreck#requestmethod-uri-options-callback
	request: function (method, uri, options, callback) {
		var start, end, req, _callback;

		function onEnd() {
			//res.removeListener('end', onEnd);
			//req.removeListener('socket', onSocket);
			end = process.hrtime(start);
			var ms = end[0] * 1e3 + end[1] * 1e-6;
			var val = ms.toFixed(3);
			val += 'ms';
			console.log(val);
		}

		if (callback) {
			_callback = function (err, res) {
				res.once('end', onEnd);
				callback(err, res);
			};
		}

		req = Wreck.request(method, uri, options, _callback);
		function onSocket() {
			start = process.hrtime();
		}
		req.once('socket', onSocket);

		return req;
	},
	//get: function () {
	//	var _wreck = Wreck.get.apply(this, arguments);
	//	return decorate(_wreck);
	//},
	//post: function () {
	//	var _wreck = Wreck.post.apply(this, arguments);
	//	return decorate(_wreck);
	//},
	//put: function () {
	//	var _wreck = Wreck.put.apply(this, arguments);
	//	return decorate(_wreck);
	//},
	//delete: function () {
	//	var _wreck = Wreck.delete.apply(this, arguments);
	//	return decorate(_wreck);
	//},
	read: function (res, options, callback) {
		Wreck.read(res, options, callback);
	}			
};

module.exports = Object.create(Wreck, {
	request: applyToDefaults(props, {value : _Wreck.request}),
	//get: applyToDefaults(props, {value : _Wreck.get}),
	//post: applyToDefaults(props, {value : _Wreck.post}),
	//put: applyToDefaults(props, {value : _Wreck.put}),
	//delete: applyToDefaults(props, {value : _Wreck.delete}),
	read: applyToDefaults(props, {value : _Wreck.read})
});