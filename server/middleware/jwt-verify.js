/* eslint-disable no-empty */
/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan

let logger = require('oe-logger')('jwt-verify');
let jwt = require('jsonwebtoken');
const verifyFinJWT = (process.env.ENABLE_FIN_SSO_JWT && (process.env.ENABLE_FIN_SSO_JWT === true || process.env.ENABLE_FIN_SSO_JWT === 'true')) ? true : false;
module.exports = function parseJwt() {
  return function (req, res, next) {
    if (!verifyFinJWT) {
      return next();
    }
    var data;
    if (req.query.access_token) {
      req.query.access_token = null;
    }
    let id = req.headers.Authorization || req.headers.authorization || req.signedCookies.authorization;
    if (id && id.split('.').length === 3) {
      logger.debug('Inside parse-jwt file');
      var secretOrPublicKey = process.env.PUBLIC_KEY || process.env.SECRET_OR_KEY;
      try {
        data = jwt.verify(id, secretOrPublicKey);
        let userinfo = JSON.parse(data.USER_ACCESS_INFO)[0];
        logger.debug('requst.accessToken present: ' + req.accessToken ? 'true' : 'false');
        if (req.accessToken) {
          req.accessToken.userAccessInfo = data.USER_ACCESS_INFO;
          req.accessToken.jwtToken = id;
          req.accessToken.tokenUserId = data.USER_ID;
          req.accessToken.username = req.accessToken.username || data.USER_ID;
          // setting the role in context as acl to work , it need role
          req.accessToken.roles = userinfo ? [userinfo.roleId] : [];
        } else {
        // setting the userId
          req.accessToken = data;
          req.accessToken.id = id;
          req.accessToken.userId = data.USER_ID;
          req.accessToken.username = data.USER_ID;
          req.accessToken.roles = userinfo ? [userinfo.roleId] : [];
        }
      } catch (e) {
        logger.debug('SSO JWT verify failed: ' + e.message);
        next(e);
      }
    }
    next();
  };
};
