const _ = require('lodash');
const path = require('path');
const BaseManager = require('./base-manager');
const debug = require('debug')('express-config');
const bodyParser = require('body-parser');
const compression = require('compression');
const crossDomain = require('../lib/middleware/cross-domain');
const serverStatus = require('../lib/middleware/server-status');
const async = require('async');

function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

module.exports = (() => {


  class MiddlewareManager extends BaseManager {

    static configureCommon(params) {
      const { app, config } = params;

      const compressionSettings = {
        threshold: config.get('compressionThreshold') || 512
      }

      // load common middleware
      app.use(parallel([
        bodyParser.urlencoded({extended: true}),
        bodyParser.json(),
        bodyParser.raw({limit: '100mb'}),
        compression(compressionSettings),
        crossDomain
      ]));

      // mount-specific middleware
      // default diagnostic route
      app.use('/diagnostic', serverStatus(app))

      // configure projected jwt endpoint
      if (config.get('jwt:secureApiWithJwt') && config.get('jwt:secret')){
        let endpoint = config.get('jwt:secureEndpoint') || '/api';
        let secret = config.get('jwt:secret');
        app.all (endpoint, jwtAuth.validateToken(secret))
      }

    }

    static configureDevelopmentEnv(params) {
      const {app} = params;
    }
  }

  return MiddlewareManager;
})();
