# oe-component-passport

This project implements multiple authentication capability provided by passportjs.

## Pre-requisites

* oe-cloud 
* oe-logger
* loopback-component-passport


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








