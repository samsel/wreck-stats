'use strict';

/*
  make sure the Wreck tests pass
  since wreck-stats is a drop in
  replacement for Wreck along
  with some stats logging feature!
*/
var rewire = require('rewire');
var WreckTests = rewire('../node_modules/wreck/test/index');

// modify the Wteck variable inside the Wreck's
// test file with our version of Wreck
var WreckStats = require('../lib/index');
// set a silent logger
WreckStats.setLogger(function(){});
WreckTests.__set__('Wreck', WreckStats);

exports.lab = WreckTests.lab;