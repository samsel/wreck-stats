wreck-stats
===========

stats plugin for wreck

#### todo
* run tests of wreck from the node_modules folder and make sure it passes.
* logger should be one time configurable or console.log to be used by default
* wreck-stats should write an object to that as an object with url, method, time, etc.
* each wreck-stats accessor should be able to pass an id (assigned by default if not) and we should write that id to the logger
* test with a local host server (that hangs request for a known time) and see if it matches the actual wreck-stats time
