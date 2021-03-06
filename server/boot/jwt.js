/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan

'use strict';
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_OR_KEY || 'secret';

module.exports = function (app) {
  if (process.env.JWT_FOR_ACCESS_TOKEN === 'true' || process.env.JWT_FOR_ACCESS_TOKEN === true) {
    const User = app.models.User;
    const AccessToken = app.models.AccessToken;
    var resolve = AccessToken.resolve;
    var tokens = {};

    User.prototype.createAccessToken = function (ttl, options, cb) {
      const userSettings = this.constructor.settings;
      const expiresIn = Math.min(ttl || userSettings.ttl, userSettings.maxTTL);
      const accessToken = jwt.sign({ id: this.id }, secretKey, { expiresIn });
      return cb ? cb(null, Object.assign(this, { accessToken })) : { id: accessToken };
    };
    // TO DO: black list jwt on logout
    //   User.logout = function(tokenId, fn) {
    //     fn();
    //   };

    AccessToken.resolve = function (id, cb) {
      if (id) {
        // is id JWT?
        if (id.split('.').length > 2) {
          try {
            const data = jwt.verify(id, secretKey);
            if (data && tokens[id]) {
              return cb(null, { userId: tokens[id] });
            }
            var query = data.email ? { email: data.email } : { username: data.username || data.user_name };
            User.findOne({ where: query }, function (err, user) {
              if (err) {
                cb(err, 'Invalid Token');
              }
              if (user) {
                tokens[id] = user.id;
                cb(null, { userId: user.id });
              } else {
                // no user found
                // ?? TO DO: create a user and login ??

                cb(null, false);
              }
            });
          } catch (err) {
            // Should override the error to 401
            err.statusCode = 401;
            cb(err);
          }
        } else {
          resolve.bind(AccessToken)(id, cb);
        }
      } else {
        cb();
      }
    };
  }
};

