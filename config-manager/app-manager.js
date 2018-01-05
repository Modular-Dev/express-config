const _ = require('lodash');
const path = require('path');
const BaseManager = require('./base-manager');
const debug = require('debug')('express-config');
const expressLayouts = require('express-ejs-layouts');

module.exports = (() => {

  function setViewEngine(config, app) {
    const viewEngine = config.get('view:engine');

    debug('view::engine:: ', viewEngine);

    const appRoot = config.get('root');

    const defaultEngine = 'ejs';
    const viewEngines = {
      'hamljs': '.haml',
      'ejs': '.html'
    }
    let validEngine = defaultEngine;
    let validExtension = viewEngines[defaultEngine];

    if (viewEngine) {
      validExtension = viewEngines[viewEngine];
      if (!validExtension) {
        let supportedEngines = Object.keys(viewEngines);
        throw new Error(`Unsupported view engine. Only supported engines are: ${supportedEngines}`)
      }
      validEngine = viewEngine
    }
    // set application accordingly
    app.set('view engine', validExtension);
    app.engine(validExtension, require(validEngine).renderFile);

    // support for ejs layouts
    if (validEngine == defaultEngine) {
      app.use(expressLayouts);
    }

    // configure view related settings
    app.set('views', path.resolve(__dirname, appRoot, config.get('view:templateRoot')));
    app.set('layout', path.resolve(__dirname, appRoot, config.get('view:templateLayouts')));

    if (!config.get('view:cache')) {
      app.set('view cache', false);
    }
  }

  class AppManager extends BaseManager {

    static configureCommon(params) {
      const { app, config } = params;
      debug('app::root:: ', config.get('root'));

      if (!config.get('root')) {
        throw new Error('Default application root path must be set!')
      }
      app.set('port', config.get('port'));
      app.set('trust proxy', 1);
      app.set('env', config.get('env') || 'development');

      setViewEngine(config, app);

    }

    static configureDevelopmentEnv(params) {
      const {app} = params;
      app.locals.pretty = true;
    }
  }

  return AppManager;
})();
