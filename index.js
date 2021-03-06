/**
 *
 * 2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

const logger = require('oe-logger');
const log = logger('oe-component-passport');
module.exports = function (app) {
  // If skipConfigurePassport is set to true, application has to call initPassport() and configurePassport()
  if (app.get('skipConfigurePassport') === true) {
    return;
  }
  const passport = require('./lib/passport');
  try {
    // these functions must be called after boot as models will not be available.
    passport.initPassport(app);
  } catch (e) {
    log.error(log.defaultContext(), e.message);
  }
};
