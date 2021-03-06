/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
/**
 * EV Passport
 *
 * @module EV Passport
 *
 */
/* eslint-disable no-console , no-process-exit*/
var loopback = require('loopback');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
module.exports.initPassport = function initPassport(app) {
  require('loopback-component-passport');
};

module.exports.configurePassport = function configurePassport(app, providerConfigParameter) {
  var loopbackPassport = require('loopback-component-passport');
  var PassportConfigurator = loopbackPassport.PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(app);

  // configure body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  var AuthSession = loopback.getModelByType('AccessToken');
  app.middleware('auth', app.loopback.token({
    model: AuthSession,
    currentUserLiteral: 'me'
  }));

  // If loopback token expires, app remoting errorHandler method does not get invoked
  app.middleware('auth', function middlewareAuthRouterFn(err, req, res, next) {
    if (err) {
      delete err.stack;
    }
    next(err);
  });

  // Providers.json will now be looked only from app if app is using framework, if framework is directly run as app, then it will be picked up from framework (so app will not fallback on framework to avoid by chance picking unintentional configuration)
  var config = {};
  // Atul : if providerConfiParameter is passed, application will used this parameter. else providers.json will be used from server folder in file system.
  // Merge util will merge providers.json from each dependent module and pass configurePassport() with this parameter
  try {
    config = providerConfigParameter ? providerConfigParameter : require(path.join(app.locals.apphome, 'providers.json'));
    config = getUpdatedConfigObject(config);
  } catch (err) {
    console.error('could not load login configuration ', path.join(app.locals.apphome, 'providers.json'), ' https://docs.strongloop.com/display/public/LB/Configuring,providers.json ', err);
    process.exit(1);
  }

  function checkDynamicParam(value) {
    var PARAM_REGEX = /\$\{(\w+)\}$/;
    var match = value.match(PARAM_REGEX);
    if (match) {
      var appValue = process.env[match[1]] || app.get(match[1]) || '';
      // eslint-disable-next-line no-undefined
      if (appValue !== undefined) {
        value = appValue;
      } else {
        console.warn('%s does not resolve to a valid value. ' +
        '"%s" must be resolvable by app.get().', value, match[1]);
      }
    }
    return value;
  }
  function getUpdatedConfigObject(element) {
    if (typeof element === 'string') {
      return checkDynamicParam(element);
    } else if (Array.isArray(element)) {
      return element.map(getUpdatedConfigObject);
    } else if (typeof element !== 'object' || element === null) {
      return element;
    }
    // recurse into object props
    var interpolated = {};
    Object.keys(element).forEach(configKey => {
      var value = element[configKey];
      if (Array.isArray(value)) {
        interpolated[configKey] = value.map(getUpdatedConfigObject);
      } else if (typeof value === 'string') {
        interpolated[configKey] = checkDynamicParam(value);
      } else if (typeof value === 'object' && Object.keys(value).length) {
        interpolated[configKey] = getUpdatedConfigObject(value);
      } else {
        interpolated[configKey] = value;
      }
    });
    return interpolated;
  }

  // to support JSON-encoded bodies
  var jsonremoting = {
    limit: '1mb'
  };
  var urlencoded = {
    limit: '1mb'
  };
  if (app.get('remoting') && app.get('remoting').json) {
    jsonremoting = app.get('remoting').json;
  }
  if (app.get('remoting') && app.get('remoting').urlencoded) {
    urlencoded = app.get('remoting').urlencoded;
  }
  app.middleware('parse', bodyParser.json(jsonremoting));
  // to support URL-encoded bodies
  app.middleware('parse', bodyParser.urlencoded(
    urlencoded));

  app.middleware('session:before', cookieParser(app.get('cookieSecret')));

  passportConfigurator.init();

  // We need flash messages to see passport errors
  // app.use(flash());
  var userModel = loopback.findModel('User');
  var userIdentityModel = loopback.findModel('UserIdentity');
  var userCredentialModel = loopback.findModel('UserCredential');
  var passportConfig = app.get('passportConfig');
  if (passportConfig) {
    if (passportConfig.userModel) {
      userModel = loopback.findModel(passportConfig.userModel);
    }
    if (passportConfig.userIdentityModel) {
      userIdentityModel = loopback.findModel(passportConfig.userIdentityModel);
    }
    if (passportConfig.userCredentialModel) {
      userCredentialModel = loopback.findModel(passportConfig.userCredentialModel);
    }
  }


  passportConfigurator.setupModels({
    userModel: userModel,
    userIdentityModel: userIdentityModel,
    userCredentialModel: userCredentialModel
  });
  for (var s in config) {
    if (config.hasOwnProperty(s)) {
      var c = config[s];
      c.session = c.session !== false;
      passportConfigurator.configureProvider(s, c);
    }
  }
};
