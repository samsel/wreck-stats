'use strict';

var applyToDefaults = require('hoek').applyToDefaults;

var defaultProps = {
	writable: false,
	enumerable: true,
	configurable: false
};

// copied from https://github.com/hapijs/wreck/blob/master/lib/index.js
function shortcutWrap(method, uri /* [options], callback */) {

	var options = (typeof arguments[2] === 'function' ? {} : arguments[2]);
	var callback = (typeof arguments[2] === 'function' ? arguments[2] : arguments[3]);

	return shortcut(method, uri, options, callback);
};


function shortcut(method, uri, options, callback) {

	return _Wreck.request(method, uri, options, function (err, res) {

		if (err) {
			return callback(err);
		}

		_Wreck.read(res, options, function (err, payload) {

			if (payload instanceof Buffer) {
				payload = payload.toString();
			}

			return callback(err, res, payload);
		});
	});
};

var properties = {
	// follow Wreck's request method signature
	// https://github.com/hapijs/wreck#requestmethod-uri-options-callback
	request: applyToDefaults(defaultProps, {value : function (method, uri, options, callback) {
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

		req = Object.getPrototypeOf(this).request(method, uri, options, _callback);
		function onSocket() {
			start = process.hrtime();
		}
		req.once('socket', onSocket);

		return req;
	}}),
	get: applyToDefaults(defaultProps, {value : function (uri, options, callback) {
		return shortcutWrap('GET', uri, options, callback);
	}}),
	post: applyToDefaults(defaultProps, {value : function (uri, options, callback) {
		return shortcutWrap('POST', uri, options, callback);
	}}),
	put: applyToDefaults(defaultProps, {value : function (uri, options, callback) {
		return shortcutWrap('PUT', uri, options, callback);
	}}),
	delete: applyToDefaults(defaultProps, {value : function (uri, options, callback) {
		return shortcutWrap('DELETE', uri, options, callback);
	}})
};

var _Wreck = module.exports = Object.create(require('wreck'), properties);