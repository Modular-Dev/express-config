const _ = require('lodash');
const path = require('path');
const BaseManager = require('./base-manager');
const debug = require('debug')('express-config');

module.exports = (() => {

  function setViewEngine(_viewEngine, app) {
    const defaultEngine = 'ejs';
    const viewEngines = {
      'hamljs': '.haml',
      'ejs': '.html'
    }
    let validEngine = defaultEngine;
    let validExtension = viewEngines[defaultEngine];

    if (_viewEngine) {
      validExtension = viewEngines[_viewEngine];
      if (!validExtension) {
        let supportedEngines = Object.keys(viewEngines);
        throw new Error(`Unsupported view engine. Only supported engines are: ${supportedEngines}`)
      }
      validEngine = _viewEngine
    }
    // set application accordingly
    app.set('view engine', validExtension);
    app.engine(validExtension, require(validEngine).renderFile);

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
      app.set('views', path.resolve(__dirname, config.get('root'), config.get('view:templateRoot')));
      app.set('layout', path.resolve(__dirname, config.get('root'), config.get('view:templateLayouts')));

      debug('view::engine:: ', config.get('view:engine'));

      setViewEngine(config.get('view:engine'), app);

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
