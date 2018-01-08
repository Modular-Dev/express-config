'use strict';

const AppManager = require('../config-manager/app-manager');
const MiddlewareManager = require('../config-manager/middleware-manager');
const ConfigurationManager = require('config-able');
const debug = require('debug')('express-config');

function getConfig(params) {
  let {overrides,defaults} = params;
  let config = new ConfigurationManager({path: params.path, overrides, defaults});
  return config;
}

module.exports = (() => {
  // Singleton pattern - only allow one active config instance
  let instance = null;

  class ExpressConfig {

    constructor(params={}) {
      if (!params.path) {
        throw new Error('Default config location needs to be provided!')
      }
      if (!params.app) {
        throw new Error('Must supply a valid express app!');
      }
      this.config = getConfig(params);

      this.app = params.app;
      if (!instance) {
        instance = this;
      }

      return instance;
    }

    configure(configurationType) {
      const {app, config} = this;

      const configurationSwitch = (configType) => ({
        "app": AppManager.load({app, config}),
        "middleware": MiddlewareManager.load({app, config})
      })[configType]

      configurationSwitch(configurationType)

    }
  }

  return ExpressConfig;

})();