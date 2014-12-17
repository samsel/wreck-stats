var Lab = require('lab');
var Http = require('http');
var Wreck = require('../lib/index');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var expect = require('code').expect;

// Test stuff
var SIMULATED_LATENCY = 1000;
var Payload = 'MY AWESOME SERVER RESPONSE';
var silentLogger = function() {};

describe('WreckStats', function () {

    describe('#setLogger', function () {

        it('should be a function and accept only a function as argument', function (done) {

            expect(typeof Wreck.setLogger).to.equal('function');
            try {
                Wreck.setLogger();
            }
            catch (e) {
                expect(e).to.be.an.instanceof(Error);
                expect(e.message).to.equal('logger should be a callable function.');
                done();
            }
        });

        it('should accept a logger function and Wreck should log to that', function (done) {

            var testLogObj = {prop:11};
            function myLogger(obj) {
                expect(obj).to.equal(testLogObj);
                // reset the logger
                Wreck.setLogger(silentLogger);
                done();
            }
            Wreck.setLogger(myLogger);
            require('../lib/logger').log(testLogObj);
        });
    });

    describe('#request', function () {

        it('should log the stats to the given logger with the stats (approx req time and other info) ', function (done) {

            function myLogger(obj) {
                expect(obj).to.be.an.object();
                expect(obj.id).to.be.a.string();
                expect(obj.method.toLowerCase()).to.equal('get');
                expect(obj.uri).to.equal('http://localhost:' + server.address().port);
                expect(obj.statusCode).to.not.equal(-1);
                var duration = parseFloat(obj.duration);
                expect(duration).to.be.at.least(SIMULATED_LATENCY);
                //safe delay assumption
                expect(duration).to.be.below(SIMULATED_LATENCY + SIMULATED_LATENCY*0.1);
                // reset the logger
                Wreck.setLogger(silentLogger);
                done();
            }

            Wreck.setLogger(myLogger);

            var server = Http.createServer(function (req, res) {
                setTimeout(function () {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(Payload);
                }, SIMULATED_LATENCY);
            });

            server.listen(0, function () {

                Wreck.get('http://localhost:' + server.address().port, {}, function (err, res, payload) {
                    expect(err).to.not.exist;
                    expect(payload.toString()).to.equal(Payload);
                    server.close();
                });
            });
        });

        it('should recover from upstream errors', function (done) {

            function myLogger(obj) {
                expect(obj).to.be.an.object();
                expect(obj.id).to.be.a.string();
                expect(obj.method.toLowerCase()).to.equal('put');
                expect(obj.uri).to.equal('http://localhost:8000000');
                expect(obj.statusCode).to.equal(-1);
                var duration = parseFloat(obj.duration);
                ////safe delay assumption
                expect(duration).to.be.below(100);
                // reset the logger
                Wreck.setLogger(silentLogger);
                done();
            }

            Wreck.setLogger(myLogger);

            Wreck.put('http://localhost:8000000', {}, function (err) {
                expect(err).to.exist;
            });
        });
    });
});