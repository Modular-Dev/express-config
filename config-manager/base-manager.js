const _ = require('lodash');
const debug = require('debug')('express-config');

module.exports = (() => {
  class BaseManager {

    static load(params={}) {
      const { app, config } = params;
      const env = config.get('env');
      if (!env) {
        throw new Error('env must be set!')
      }
      const action = `configure${_.capitalize(env)}Env`
      this.configureCommon(params);
      this[action](params);
    }

    static configureCommon(params={}) {}

    static configureProductionEnv(params={}) {}

    static configureDevelopmentEnv(params={}) {}
  }

  return BaseManager;
})();
