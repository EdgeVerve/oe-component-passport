/**
 *
 * �2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

// Author : Dipayan

var secure = (process.env.PROTOCOL && process.env.PROTOCOL == 'https' ? true : false)
module.exports = function(app, cb){
    // add afterRemote for login/logout to add/clear cookie 
    if(process.env.ENABLE_COOKIE && (process.env.ENABLE_COOKIE === true|| process.env.ENABLE_COOKIE === 'true')){
        var user = app.models.User;
        user.afterRemote('login', function(ctx, modelInstance, next) {
            let res = ctx.res;
            let req = ctx.req;
            if (ctx.result && ctx.result.id) {
                res.cookie('authorization', ctx.result.id, {
                    signed: req.signedCookies ? true : false,
                    // maxAge is in ms
                    maxAge: 1000 * ctx.result.ttl,
                    secure: secure ? true : false,
                    httpOnly: true
                });
                // commented code to enable sending access_token cookie with full access token
                // res.cookie('access_token', ctx.result, {
                //     signed: req.signedCookies ? true : false,
                //     // maxAge is in ms
                //     maxAge: 1000 * ctx.result.ttl,
                //     secure: secure ? true : false,
                //     httpOnly: true
                // });
                // res.cookie('userId', ctx.result.userId.toString(), {
                //     signed: req.signedCookies ? true : false,
                //     maxAge: 1000 * ctx.result.ttl,
                //     secure: secure ? true : false,
                //     httpOnly: true
                // });
            }
            return next();
        });
        user.afterRemote('logout', function(ctx, modelInstance, next) {
            let res = ctx.res;
            res.clearCookie('access_token');
            res.clearCookie('userId');
            return next();
        });
    }
    cb();
}