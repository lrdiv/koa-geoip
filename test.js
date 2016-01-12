var koa        = require('koa');
var chai       = require('chai');
var request    = require('supertest');
var geolocate  = require('./');

var app, server, msg;

describe('geolocate()', function() {
  it('should set req query param of geoipCityState', function(done) {
    var app = setupServer()
    request(app.listen())
      .get('/')
      .set('X-Forwarded-For', '67.176.232.51')
      .end(function(err, res) {
        chai.expect(res.text).to.equal('Mount Prospect, IL, US');
        done();
      });
  });
  
  it('should hit whitelisted routes', function(done) {
    var app = setupServer({
      whitelist: ['/locate','/foo','/bar']
    });
    request(app.listen())
      .get('/bar')
      .set('X-Forwarded-For', '67.176.232.51')
      .end(function(err, res) {
        chai.expect(res.text).to.equal('Mount Prospect, IL, US');
        done();
      });
  });

  it('should not hit un-whitelisted routes', function(done) {
    var app = setupServer({
      whitelist: ['/locate','/foo','/bar']
    });
    request(app.listen())
      .get('/baz')
      .set('X-Forwarded-For', '67.176.232.51')
      .end(function(err, res) {
        chai.expect(res.text).to.not.equal('Mount Prospect, IL, US');
        done();
      })
  });
});

var setupServer = function(options) {
  var app = koa();
  app.proxy = true;
  app.use(geolocate(options));
  app.use(function *(next) {
    this.body = this.request.query.geoipCityState;
  });
  return app;
}
