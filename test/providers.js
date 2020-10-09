var passport = require('passport');
var _ = require('underscore');

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
  }
}

module.exports = options;
