const _ = require('lodash');
const path = require('path');
const BaseManager = require('./base-manager');
const debug = require('debug')('express-config');
const bodyParser = require('body-parser');
const compression = require('compression');
const crossDomain = require('../lib/middleware/cross-domain');
const serverStatus = require('../lib/middleware/server-status');
const noCache = require('../lib/middleware/no-cache');
const helmet = require('helmet');
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

      // use Helmet early in the middleware stack so that its headers are sure to be set.
      app.use(helmet())

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
      // no cache for dev files
      app.use(noCache);
    }
  }

  return MiddlewareManager;
})();
