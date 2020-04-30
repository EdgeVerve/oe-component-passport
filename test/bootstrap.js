var oecloud = require('oe-cloud');
var logger = require('oe-logger');
var log = logger('test-bootstrapper');

// var loopback = require('loopback');
// oecloud.attachMixinsToBaseEntity("SkeletonMixin");
process.env.userfieldname = 'username';
process.env.PASSWORD_FIELD_NAME = 'password';
process.env.JWT_SECRET_KEY = 'secret';
process.env.JWT_FOR_ACCESS_TOKEN = true;

oecloud.observe('loaded', function (ctx, next) {
  console.log('oe-cloud modules loaded');
  return next();
});

var testContext = {
  ctx: {
    tenantId: 'test-tenant'
  }
};

oecloud.get('/info', function (req, res) {
  return res.end(JSON.stringify({'status': 'logged in', 'access-token': res.accessToken}));
});

oecloud.get('/failed', function (req, res) {
  return res.end(JSON.stringify({'status': 'failed'}));
});

oecloud.boot(__dirname, function (err) {
  if (err) {
    log.error(testContext, err);
    // console.log('Error:', err)
    process.exit(1);
  }
  oecloud.start();
  oecloud.emit('test-start');
});

module.exports = new Promise(booted =>
  oecloud.on('test-start', () => {
    // debugger;
    // console.log('booted');
    booted();
  } ) );
