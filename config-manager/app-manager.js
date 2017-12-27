const _ = require('lodash');
const ejs = require('ejs');
const path = require('path');
const BaseManager = require('./base-manager');
const debug = require('debug')('express-config');

module.exports = (() => {
  class AppManager extends BaseManager {

    static configureCommon(params) {
      const { app, config } = params;
      debug('app::root:: ', config.get('root'));
      app.set('port', config.get('port'));
      app.set('trust proxy', 1);
      app.set('env', config.get('env') || 'development');
      app.set('view engine', 'html');
      app.engine('html', require('ejs').renderFile);
      app.set('views', path.resolve(__dirname, config.get('root'), config.get('templateRoot')));
      app.set('layout', path.resolve(__dirname, config.get('root'), config.get('templateLayouts')));

      if (!config.get('views:cache')) {
        app.set('view cache', false);
      }
    }

    static configureDevelopmentEnv(params) {
      const {app} = params;
      app.locals.pretty = true;
    }
  }

  return AppManager;
})();
