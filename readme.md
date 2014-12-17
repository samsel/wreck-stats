wreck-stats
===========
wreck-stats is [wreck](https://github.com/hapijs/wreck) with a stats logging feature.

[![Build Status](https://travis-ci.org/samsel/wreck-stats.svg)](https://travis-ci.org/samsel/wreck-stats)


## Usage
```javascript
var Wreck = require('wreck-stats');

// All the methods exposed by Wreck
// https://github.com/hapijs/wreck#advanced
// are available while using wreck-stats.

// Additionally, you can define your logger on Wreck-Stats like below

// your logger
function Logger(stats) {
  console.log(stats);
}

// give your logger to Wreck for logging
// Note: this is a one time configuration.
Wreck.setLogger(Logger);

Wreck.get('https://google.com/', function (err, res, payload) {
    /* do stuff */
});
```

### `stats`
The object that contains the stats info for each request made by Wreck.
It has the below properties.
- `id` - A unique identifier string for each request.
- `method` - The HTTP methods of the request.
- `uri` - The URI of the request.
- `statusCode` - The HTTP response status code.
- `duration` - The duration taken to process the request (in milliseconds).
