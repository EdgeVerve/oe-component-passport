var chai = require('chai');
chai.use(require('chai-things'));

var bootstrapped = require('./bootstrap');

describe("basic tests", () => {
  before('wait for boot', function(done){
    bootstrapped.then(() => done());
  });
});