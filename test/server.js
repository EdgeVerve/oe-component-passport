/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan
var oecloud = require('oe-cloud');
oecloud.observe('loaded', function (ctx, next) {
  return next();
});

oecloud.boot(__dirname, function (err) {
  oecloud.start();
});

