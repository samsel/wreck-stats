'use strict';

var UUID = require('node-uuid'),
  Logger = require('./logger'),
  properties,
  _Wreck;

properties = {

  request: objectPropertyWrap(function(method, uri, options, callback) {
    var start, end, req, res, proto, stats = {};

    proto = Object.getPrototypeOf(this);
    stats.id = UUID.v1();
    stats.method = method;
    stats.uri = uri;

    function clean() {
      if (req) {
        req.removeListener('socket', onSocket);
        req.removeListener('error', onEnd);
      }
      if (res) {
        res.removeListener('end', onEnd);
        res.removeListener('error', onEnd);
        res.removeListener('close', onEnd);
      }
    }

    function onSocket() {
      start = process.hrtime();
    }

    function onEnd() {
      clean();
      if (!start) {
        stats.duration = '0.0';
      }
      else {
        end = process.hrtime(start);
        var ms = end[0] * 1e3 + end[1] * 1e-6;
        stats.duration = ms.toFixed(3);
        stats.statusCode = res ? res.statusCode : -1;
      }
      Logger.log(stats);
    }

    function onRequest(err, response) {
      clean(); // to clean the listeners on req
      if (err) {
        return callback(err, res);
      }

      res = response;
      res.once('end', onEnd);
      res.once('error', onEnd);
      res.once('close', onEnd);
      callback(err, res);
    }

    if (callback) {
      req = proto.request(method, uri, options, onRequest);
      if (req) {
        req.once('socket', onSocket);
        req.once('error', onEnd);
      }
    }
    else {
      req = proto.request(method, uri, options, callback);
    }

    return req;
  }),

  get: objectPropertyWrap(function(uri, options, callback) {
    return shortcutWrap('GET', uri, options, callback);
  }),

  post: objectPropertyWrap(function(uri, options, callback) {
    return shortcutWrap('POST', uri, options, callback);
  }),

  put: objectPropertyWrap(function(uri, options, callback) {
    return shortcutWrap('PUT', uri, options, callback);
  }),

  delete: objectPropertyWrap(function(uri, options, callback) {
    return shortcutWrap('DELETE', uri, options, callback);
  }),

  setLogger: objectPropertyWrap(function(_logger) {
    return Logger.setLogger(_logger);
  })
};

function objectPropertyWrap(val) {
  return {
    writable: false,
    enumerable: true,
    configurable: false,
    value: val
  };
}

// borrowed from -
// https://github.com/hapijs/wreck/blob/master/lib/index.js
function shortcutWrap(method, uri /* [options], callback */) {

  var options = (typeof arguments[2] === 'function' ? {} : arguments[2]),
    callback = (typeof arguments[2] === 'function' ? arguments[2] : arguments[3]);

  return shortcut(method, uri, options, callback);
}

function shortcut(method, uri, options, callback) {

  return _Wreck.request(method, uri, options, function(err, res) {

    if (err) {
      return callback(err);
    }

    _Wreck.read(res, options, function(err, payload) {
      if (payload instanceof Buffer) {
        payload = payload.toString();
      }

      return callback(err, res, payload);
    });
  });
}

_Wreck = module.exports = Object.create(require('wreck'), properties);
