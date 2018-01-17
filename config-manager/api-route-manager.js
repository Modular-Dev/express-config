const BaseManager = require('./base-manager');
const express = require('express');
const debug = require('debug')('express-config');

module.exports = (() => {


  class ApiRouteManager extends BaseManager {

    static configureCommon(params) {
      const { app, config } = params;
      let router;
      const customRouter = config.get('api:router');
      const apiEndpoint = config.get('api:mount') || '/api';

      if(!customRouter) {
        router = express.Router();
      }

      app.use(apiEndpoint, router);   

    }

    static configureDevelopmentEnv(params) {
      const {app} = params;
    }
  }

  return ApiRouteManager;
})();
