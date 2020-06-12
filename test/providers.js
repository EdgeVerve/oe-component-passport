var passport = require('passport');
var _ = require('underscore');

var FININFRA_HOST = process.env.FININFRA_HOST || 'https://bl4ul27g.ad.infosys.com';
var FININFRA_PORT = process.env.FININFRA_PORT || '7500';
var CALLBACK_URL =  process.env.FININFRA_CALLBACK_URL || "https://bgapp.oecloud.local/auth/callback";
var CLIENT_SECRET = process.env.FININFRA_CLIENT_SECRET || "test_app_0.09546362142492948"; 
var CLIENT_ID = process.env.FININFRA_CLIENT_ID || "test_app"; 

var options = {
  "local": {
    "provider": "local",
    "module": "passport-local",
    "usernameField": "${userfieldname}",
    "passwordField": "${PASSWORD_FIELD_NAME}",
    "authPath": "/auth/local",
    "successRedirect": "/info",
    "failureRedirect": "/failed",
    "failureFlash": false,
    "callbackHTTPMethod": "post",
    "setAccessToken": true,
    "session": false,
    "forceDefaultCallback": true,
    "cookie": true,
    "json": true
  },
    "finaclelogin": {
        "provider": "Finacle",
        "module": "fininfra",
        "strategy": "OAuth2Strategy",
        "clientID": CLIENT_ID,
        "clientSecret": CLIENT_SECRET,
        "authPath": "/auth/finacle",
        "callbackPath": "/auth/callback",
        "json": true,
        "callbackURL": CALLBACK_URL,
        "authorizationURL": FININFRA_HOST + ':' + FININFRA_PORT + "/fininfra/auth",
        "tokenURL": FININFRA_HOST + ':' + FININFRA_PORT + "/fininfra/token",
        "profileURL": FININFRA_HOST + ':' + FININFRA_PORT + "/fininfra/api/users/profile",
        "logout": FININFRA_HOST + ':' + FININFRA_PORT + "/fininfra/api/logout",
        "cookie": true,
        "successRedirect": "/",
        "failureRedirect": "/",
        "scope": [
            "userId",
            "profile"
        ],
        "failureFlash": true
    }
}

var customCallback = function fnCustomCallback(req, res, next){
    // The custom callback
    var session = options.finaclelogin.session || false;
    passport.authenticate('finaclelogin', _.defaults({session: session},
        options.authOptions), function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          if (!!options.finaclelogin.json) {
            return res.status(401).json(g.f('authentication error'));
          }
          if (options.failureQueryString && info) {
            return res.redirect(options.finaclelogin.failureRedirect);
          }
          return res.redirect(options.finaclelogin.failureRedirect);
        }
        if (session) {
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            if (info && info.accessToken) {
              if (!!options.finaclelogin.json) {
                return res.json({
                  'access_token': info.accessToken.id,
                  'auth_token': info.identity.credentials && info.identity.credentials.accessToken || '',
                  userId: user.id
                });
              } else {
                res.cookie('access_token', info.accessToken.id,
                  {
                    signed: req.signedCookies ? true : false,
                    // maxAge is in ms
                    maxAge: 1000 * info.accessToken.ttl,
                    domain: (options.domain) ? options.domain : null,
                  });
                res.cookie('userId', user.id.toString(), {
                  signed: req.signedCookies ? true : false,
                  maxAge: 1000 * info.accessToken.ttl,
                  domain: (options.domain) ? options.domain : null,
                });
                if(info.identity.credentials && info.identity.credentials.accessToken){
                    res.cookie('token', info.identity.credentials.accessToken, {
                        signed: req.signedCookies ? true : false,
                        maxAge: 1000 * info.accessToken.ttl,
                      });
                  }
              }
            }
            return res.redirect(options.finaclelogin.successRedirect);
          });
        } else {
          if (info && info.accessToken) {
            if (!!options.finaclelogin.json) {
              return res.json({
                'access_token': info.accessToken.id,
                'auth_token': info.identity.credentials && info.identity.credentials.accessToken || '',
                userId: user.id
              });
            } else {
              res.cookie('access_token', info.accessToken.id, {
                signed: req.signedCookies ? true : false,
                maxAge: 1000 * info.accessToken.ttl,
              });
              res.cookie('userId', user.id.toString(), {
                signed: req.signedCookies ? true : false,
                maxAge: 1000 * info.accessToken.ttl,
              });
              if(info.identity.credentials && info.identity.credentials.accessToken){
                res.cookie('token', info.identity.credentials.accessToken, {
                    signed: req.signedCookies ? true : false,
                    maxAge: 1000 * info.accessToken.ttl,
                  });
              }
            }
          }
          return res.redirect(options.finaclelogin.successRedirect);
        }
      })(req, res, next);
}


options.finaclelogin.customCallback = customCallback;

module.exports = options;
