'use strict';

var sinon = require('sinon'),
  chai = require('chai'),
  path = require('path'),
  express = require('express'),
  request = require('supertest-as-promised'),
  ExpressConfig = require('../lib');

var assert = chai.assert;
chai.should();

var configDir = path.resolve(__dirname + '/config');

var configureApp = function (expressConfig) {
  expressConfig.configure('app');
  expressConfig.configure('middleware');
  expressConfig.configure('assets');
  expressConfig.configure('api')
  //test routes
  expressConfig.app.get('/test', renderTemplate);
}

var renderTemplate = function(req, res){
  let data = { test: 123 };
  res.render('index', {
      content: "<div>Hello World</div>",
      context: JSON.stringify(data)
  });
}


describe('Express Config', function () {
  let emptyParams = {};
  let noAppParams = {
    path: configDir
  };
  let validParams = {
    path: configDir,
    app: express(),
    defaults: {
      root: path.resolve(`${process.cwd()}/test`)
    }
  }

  beforeEach(function() {
    
    this.expressConfig = new ExpressConfig(validParams);
    this.settings = this.expressConfig.config;

    configureApp(this.expressConfig);
  })


  describe('constructor', function() {
    it('should throw an error if no config path is provided', function () {
      assert.throws(()=> new ExpressConfig(emptyParams), Error,  'Default config location needs to be provided!');
    });
    it('should throw an error if no express app instance is provided', function () {
      assert.throws(()=> new ExpressConfig(noAppParams), Error,  'Must supply a valid express app!');
    });
  });
  describe('Config settings', function(){
    it('should contain expected config values', function(){
      assert.equal(this.settings.get('view:templateLayouts'), "templates/layouts/layout", 'Retrieve template layout setting')
    })
  })
  describe('Specify a view engine', function(){
    it('should configure the specified view engine', function(){
      assert.equal(this.settings.get('view:engine'), 'ejs', 'Template settings specified')
    })
  })
  describe('Configure', function(){
    it('should configure an express app from specified configs', function() {
      var port = this.expressConfig.app.get('port');
      assert.equal(port, this.expressConfig.config.get('port'), 'Configured express app must match specified config')
    })
  })

  describe('Views/Templating', function(){
    it('should render specified view', function() {
      let server = this.expressConfig.app.listen(9898)
      request(server)
      .get("/test")
      .expect(200)
      .then ((res) => {
        server.close();
      })
    })
  })

  describe('Middleware loaded', function(){
    it('should get diagnostic middleware route', function(){
      let server = this.expressConfig.app.listen(9898)
      request(server)
      .get("/diagnostic")
      .expect(200)
      .then ((res) => {
        assert.equal(res.body.status, 'up', 'status must be returned');
        server.close();
      })
    })
  })

});
