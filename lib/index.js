'use strict';

// copied from https://github.com/hapijs/wreck/blob/master/lib/index.js
function shortcutWrap(method, uri /* [options], callback */) {

	var options = (typeof arguments[2] === 'function' ? {} : arguments[2]);
	var callback = (typeof arguments[2] === 'function' ? arguments[2] : arguments[3]);

	return shortcut(method, uri, options, callback);
};


function shortcut(method, uri, options, callback) {

	return Wreck_Stats.request(method, uri, options, function (err, res) {

		if (err) {
			return callback(err);
		}

		Wreck_Stats.read(res, options, function (err, payload) {

			if (payload instanceof Buffer) {
				payload = payload.toString();
			}

			return callback(err, res, payload);
		});
	});
};

function ObjectPropertyWrap(val) {
	return {
		writable: false,
		enumerable: true,
		configurable: false,
		value: val
	};
}

var properties = {
	// follow Wreck's request method signature
	// https://github.com/hapijs/wreck#requestmethod-uri-options-callback
	request: ObjectPropertyWrap(function (method, uri, options, callback) {
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
	}),
	get: ObjectPropertyWrap(function (uri, options, callback) {
		return shortcutWrap('GET', uri, options, callback);
	}),
	post: ObjectPropertyWrap(function (uri, options, callback) {
		return shortcutWrap('POST', uri, options, callback);
	}),
	put: ObjectPropertyWrap(function (uri, options, callback) {
		return shortcutWrap('PUT', uri, options, callback);
	}),
	delete: ObjectPropertyWrap(function (uri, options, callback) {
		return shortcutWrap('DELETE', uri, options, callback);
	})
};

var Wreck_Stats = module.exports = Object.create(require('wreck'), properties);