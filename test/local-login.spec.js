/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var chai = require('chai');
var expect = chai.expect;
var app = require('oe-cloud');
chai.use(require('chai-things'));
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var api = defaults(supertest(app));;
process.env.userfieldname = 'username';
process.env.PASSWORD_FIELD_NAME = 'password';

describe(chalk.blue('model-validation PropertyLevel Validation test'), function () {
    this.timeout(20000);
      before('wait for boot', function(done){
          bootstrap.then(() => {
          // debugger
          //create user
      api.post('/api/Users')
        .set('Accept', 'application/json')
            .send({
            "username":"admin",
            "email":"admin@ev.com",
            "password":"admin"
            })
            .end(function(err){
                if(err){
                done();
                }
                done();
            })
          })
          .catch(done)
      });

      it('should login using auth/local and get accesstoken', function(done){
        api.post('/auth/local')
        .set('Accept', 'application/json')
        .send({
          "username":"admin",
          "password":"admin"
          })
          .end(function(err, res){
              if(err)
                done(err)
              
            expect(err).to.be.null;
            expect(res.id).not.to.be.null;
            console.info('login successful, access token generated', res);
            done();
               
          })
      });

    });
