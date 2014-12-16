'use strict';

/*
  make sure the Wreck tests pass
  since wreck-stats is a drop in
  replacement for Wreck along
  with some stats logging feature!
*/
var Rewire = require('rewire');
var WreckTests = Rewire('../node_modules/wreck/test/index');

// modify the `Wreck` private variable inside the Wreck's
// test file with our version of Wreck and our expect library!
var WreckStats = require('../lib/index');
WreckTests.__set__('Wreck', WreckStats);
WreckTests.__set__('expect', require('code').expect);
// finally, set a silent logger :)
WreckStats.setLogger(function(){});

exports.lab = WreckTests.lab;