'use strict';

// default logger
var Logger = console.dir;

module.exports = {

  get log() {
    return Logger;
  },

  set log(logger) {
    console.assert(typeof logger === 'function', 'logger should be a callable function.');
    Logger = logger;
  }
};
