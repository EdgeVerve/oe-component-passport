# oe-validation

This project implements validation functionality on Models.

## Pre-requisites

* oe-cloud 
* oe-logger
* loopback-component-passport


## Features

1. Local and 3rd party authentication support (like Facebook, google oauth authentication)
2. JWT authentication support
3. Configurable "Cookie" generation with users/login api (set ENABLE_COOKIE=true)

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

Examples are coming up in oe-demo-app project.






