/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan

/**
 * Boot file to add injected accessToken roles to context principals
 * checks if ENABLE_FIN_SSO_JWT is true in environment variable
 * this code executes when role is injected in middleware as part of JWT verification
 */
let logger = require('oe-logger')('inject-jwt-principals');
module.exports = function fnInjectJwtPrincipals(app) {
  if (process.env.ENABLE_FIN_SSO_JWT && (process.env.ENABLE_FIN_SSO_JWT === true || process.env.ENABLE_FIN_SSO_JWT === 'true')) {
    var ACL = app.models.ACL;
    var _checkAccessForContext = ACL.checkAccessForContext;
    var ctx = require('loopback/lib/access-context');
    var AccessContext = ctx.AccessContext;
    var RoleMapping = app.models.RoleMapping;
    // if any security vulnarebility occures
    // add one more layer of check that this accessToken modification done by valid middleware and verified
    // e.g by checking any env variable that JWT verify is enabled or any other means
    ACL.checkAccessForContext = function fnCheckAccessForContext(context, callback) {
    // instantiating AccessContext
      if (!(context instanceof AccessContext)) {
        context.registry = this.registry;
        context = new AccessContext(context);
      }
      // Checking the AccessContext has accessToken with roles attached
      if (context.accessToken && context.accessToken.roles && Array.isArray(context.accessToken.roles)) {
        context.accessToken.roles.forEach((role) => {
          context.addPrincipal(RoleMapping.ROLE, role);
        });
      }
      _checkAccessForContext.bind(ACL)(context, callback);
    };
  }
};
