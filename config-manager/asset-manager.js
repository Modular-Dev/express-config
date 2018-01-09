const _ = require('lodash');
const path = require('path');
const BaseManager = require('./base-manager');
const express = require('express');
const debug = require('debug')('express-config');


function configureStaticFolders(folders, root) {
  return adjustedFolders = folders.map((folder) => path.resolve(__dirname, root, folder))
}

module.exports = (() => {


  class AssetManager extends BaseManager {

    static configureCommon(params) {
      const { app, config } = params;

      const staticFolders = config.get('static:staticFolders')
      debug('staticFolders:: ', staticFolders)
      debug('app root:: ', config.get('root'))
      const adjustedFolders = configureStaticFolders(staticFolders, config.get('root'))

      adjustedFolders.forEach(function(folder){
        const staticMount = config.get('static:folderMount')
        const staticSettings = {
          maxAge: config.get('maxAge')
        }
        app.use(staticMount, express.static(folder, staticSettings))
      })
    }

    static configureDevelopmentEnv(params) {
      const {app} = params;
    }
  }

  return AssetManager;
})();
