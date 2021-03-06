# oe-component-passport

This project implements multiple authentication capability provided by passportjs.

## Pre-requisites

* oe-cloud 
* oe-logger
* loopback-component-passport
* Configure model-config.json of application with UserIdentity and UserCredential with proper datasource as per application's datasource configuration 


## Features

1. Local and 3rd party authentication support (like Facebook, google oauth authentication)
2. JWT authentication support
3. JWT as access_token
4. Configurable "Cookie" generation with users/login api (set ENABLE_COOKIE=true)
5. Parameterized providers.json

### Difference from previous version of oe-cloud

1. All extented models - BaseUser, BaseRole, BaseUserRoleMapping etc has been removed. 
2. Depricated custom functions, like password compelxity, account lockout (as result of point 1)
3. removal of custom cookies (default cookie of passportjs remains)
4. Standardized with loopback authentication.
5. Depricated use of custom headers for authentication (like x-jwt-assertion)
6. Depricated trusted app - this feature can be used by creating service account user in normal User model and use this account for external app login


## Usage and Example

Usage of this module needs an entry in package.json and also an entry to application's app-list.json 
```
{
    "path": "oe-component-passport",
    "enabled": true
  },
```

Inside your application, authentication can be done using "/User/login" or "/auth/local" which returns access_token as payload and in cookie if configured.
### Configure model-config.json

Add UserIdentity and UserCredential models in your application's model-config.json (in your application's server directory) with correct dataSource name. 
Also set public true or false depending on your requirement to expose those as REST API or not.

```
"UserCredential": {
    "dataSource": "db",
    "public": false
  },
  "UserIdentity": {
    "dataSource": "db",
    "public": false
  }
```

### Parameterized providers.json

You can write providers json like this where you can parameterise a value like *${variable_name}*

``` javascript
{
  "local": {
    "provider": "local",
    "module": "passport-local",
    "usernameField": "${userfieldname}",
    "passwordField": "${PASSWORD_FIELD_NAME}",
    "authPath": "/auth/local",
    "successRedirect": "/explorer",
    "failureRedirect": "/login",
    "failureFlash": false,
    "callbackHTTPMethod": "post",
    "setAccessToken": true
  }
}

```
In above example, usernameField value would be set to value of environment (or configuration) variable '**userfieldname**' and passwordField value would be from environment (or configuration) variable '**PASSWORD_FIELD_NAME**'. If those environmental variables are not set or not in configuration, '' (blank string) would be assigned.

#### Environment variables

**SECRET_OR_KEY** or **PUBLIC_KEY** should be JWT server public key as base64 string (should be properly formated and the public key)
**ENABLE_FIN_SSO_JWT** set to true

### JWT_FOR_ACCESS_TOKEN
To improve performance JWT can be used as access token. to enable that, set following environmental variable
``` javascript
SECRET_OR_KEY = 'secret'
JWT_FOR_ACCESS_TOKEN = true;
```
*SECRET_OR_KEY* could be any secret consisting alphanumeric value. If **JWT_FOR_ACCESS_TOKEN** is set true, and any SSO also needs to be used, set SSO certificate to **PUBLIC_KEY**


Please note that this implementation of JWT just replaces generic access-token with JWT and saves checking user id from database for api every request that needs authentication (ACL). 

To implement custom JWT payload to have user roles(to use in ACL varification) and other details; override User.login function along with User.prototype.createAccessToken and AccessToken.resolve

For any other login related customization, like password complexity, password history etc; please extend User model and add customized code in extended model (some example available in oe-demo-app)

The certificate format should be similar to this

``` javascript
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiUdFD5LPHdPKpSD+HpLzkfN6/
y0BDAbyo2srzBhQl81oqg+HPI/03jOsWs0cP0uS0eZOmrrlujLfbG+R3WKN5xPvB
brOBBA7N8axDRRZWoWkEX3KX2vaUfAxfQNp3tUhegliHtrLVPyutnowlY3f7/TzX
JbEND/PONc0VpaEf4wIDAQAB
-----END PUBLIC KEY-----
```







