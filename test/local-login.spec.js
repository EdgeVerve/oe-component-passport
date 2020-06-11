/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
var chalk = require('chalk');
var bootstrap = require('./bootstrap');
var app = require('oe-cloud');
models = app.models;
var defaultContext = {'ctx': {'tenantId': 'default'}};
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var api = defaults(supertest(app));
var accessToken = '';

<<<<<<< HEAD
describe(chalk.blue('oe-component-passport: Local Authentication Tests'), function () {
    this.timeout(600000);
      before('wait for boot', function(done){
          bootstrap.then(() => {
          // debugger
          //create user
            done();
          })
          .catch(done)
      });
=======
describe(chalk.blue('model-validation PropertyLevel Validation test'), function () {
  this.timeout(600000);
  before('wait for boot', function (done) {
    bootstrap.then(() => {
      // debugger
      // create user
      done();
    })
      .catch(done);
  });
>>>>>>> a2010d7933ae999e4278e523e42ae71a42d82c99

  before('create user', function (done) {
    var userData = {
      'id': 'admin',
      'username': 'admin',
      'email': 'admin@ev.com',
      'password': 'admin',
      'emailVerified': false
    };
    models.User.create(userData, defaultContext, function (err, user) {
      if (err) {
        done(err);
      } else {
        user.updateAttributes({'emailVerified': true }, defaultContext, function (err) {
          done(err);
        });
      }
    });
  });

  after('remove user', function (done) {
    models.User.destroyById('admin', function (err) {
      models.ModelDefinition.destroyById('tEsTmOdEl', function (err) {
        done(err);
      });
    });
  });

  it('should login using auth/local', function (done) {
    api.post('/auth/local')
      .set('Accept', 'application/json')
      .send({
        'username': 'admin',
        'password': 'admin'
      })
      .expect(302)
      .expect('Location', '/info')
      .end(function (err) {
        if (err) {done(err);}

        expect(err).to.be.null;
        console.info('login successful');
        done();
      });
  });

  it('should fail to login using auth/local', function (done) {
    api.post('/auth/local')
      .set('Accept', 'application/json')
      .send({
        'username': 'admin',
        'password': 'admin1'
      })
      .expect(302)
      .expect('Location', '/failed')
      .end(function (err) {
        if (err) {done(err);}

        expect(err).to.be.null;
        console.info('login failed as expected');
        done();
      });
  });

  it('should contain access token which is a JWT', function (done) {
    models.User.login({'username': 'admin', 'password': 'admin'}, function (err, res) {
      accessToken = res.accessToken;
      expect(res.accessToken).to.be.defined;
      expect(res.accessToken.split('.').length).equals(3);
      done(err);
    });
  });

  it('should successfully POST with access token which is a JWT', function (done) {
    api.post('/api/ModelDefinitions?access_token=' + accessToken)
      .set('Accept', 'application/json')
      .send({
        'id': 'tEsTmOdEl',
        'name': 'TestModel',
        'properties': {
          'customer name': 'string',
          'type': 'number'
        }
      })
      .expect(200)
      .end(function (err, response) {
        if (err) {done(err);}

        expect(err).to.be.null;
        expect(response.body.name).equals('TestModel');
        done();
      });
  });
});
