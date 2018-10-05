/**
 *
 * 2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Atul
var oecloud = require('oe-cloud');

oecloud.observe('loaded', function (ctx, next) {
  return next();
})

oecloud.boot(__dirname, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  var loopback = require('loopback');
  oecloud.start();
  oecloud.emit('test-start');
});

describe('Oe Passport Component Test Started', function () {
  this.timeout(15000);
  it('Waiting for application to start', function (done) {
    oecloud.on('test-start', function () {
      done();
    });
  });
});



