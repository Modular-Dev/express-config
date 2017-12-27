'use strict';

var sinon = require('sinon'),
  chai = require('chai'),
  path = require('path'),
  express = require('express'),
  ExpressConfig = require('../lib');

var assert = chai.assert;
chai.should();

var configDir = path.resolve(__dirname + '/config');

describe('Express Config', function () {
  beforeEach(function(){
    this.emptyParams = {};
    this.noAppParams = {path: configDir};
    this.validParams = {
        path: configDir,
        app: express(),
        defaults: {
          root: process.cwd()
        }
      }
  })
  describe('constructor', function () {
    it('should throw an error if no config path is provided', function () {
      assert.throws(()=> new ExpressConfig(this.emptyParams), Error,  'Default config location needs to be provided!');
    });
    it('should throw an error if no express app instance is provided', function () {
      assert.throws(()=> new ExpressConfig(this.noAppParams), Error,  'Must supply a valid express app!');
    });
  });
  describe('Config settings', function(){
    it('should contain expected config values', function(){
      var expressConfig = new ExpressConfig(this.validParams);
      var settings = expressConfig.config;
      assert.equal(settings.get('templateLayouts'), "templates/layouts", 'Retrieve template layout setting')
    })
  })

  describe('Configure', function(){
    it('should configure an express app from specified configs', function() {
      var expressConfig = new ExpressConfig(this.validParams);
      expressConfig.configure('app');
      var port = expressConfig.app.get('port');
      assert.equal(port, expressConfig.config.get('port'), 'Configured express app must match specified config')
    })
  })

});
