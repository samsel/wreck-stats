'use strict';

function Logger() {}

// default logger
Logger.prototype.log = console.dir;

Logger.prototype.setLogger = function (_logger) {
    console.assert(typeof _logger === 'function', 'logger should be a callable function.');
    this.log = _logger;
};

module.exports = new Logger();