/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan

const passport = require('../../lib/passport');
const path = require('path');
const logger = require('oe-logger');
const log = logger('oe-component-passport');

module.exports = function (app) {
  // If skipConfigurePassport is set to true, application has to call initPassport() and configurePassport()
  if (app.get('skipConfigurePassport') === true) {
    return;
  }
  var cwd = process.cwd();
  var providerJson;

  var passportConfig = app.get('passportConfig');
  var p;
  if (passportConfig && passportConfig.providerJson) {
    p = path.resolve(cwd, passportConfig.providerJson);
    providerJson = require(p);
    log.info(log.defaultContext(), 'Provider loaded from ', p);
  }

  if (!providerJson) {
    try {
      p = path.resolve(cwd, 'providers');
      providerJson = require(p);
      log.info(log.defaultContext(), 'Provider loaded from ', p);
    } catch (e) {
      throw new Error(e);
    }
  }

  try {
    // these functions must be called after boot as models will not be available.
    passport.configurePassport(app, providerJson);
  } catch (e) {
    log.info({}, 'Please check User, UserIdentiry and UserCredential models are configured in your application\'s model-config.json');
    log.error({}, e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};
