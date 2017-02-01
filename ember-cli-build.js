/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var config = require('./config/environment')(process.env.EMBER_ENV || 'development');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      prepend: config.prepend,
      exclude: [
        'images/layers-2x.png',
        'images/layers.png',
        'images/marker-icon-2x.png',
        'images/marker-icon.png',
        'images/marker-shadow.png'
      ]
    },
    SemanticUI: {
      // These flags allow you do turn on or off auto imports for Semantic UI
      import: {
        css: false,
        javascript: true,
        images: true,
        fonts: true
      }
    }
  });

  app.import('bower_components/leaflet-icon-pulse/src/L.Icon.Pulse.js');
  app.import('bower_components/leaflet-icon-pulse/src/L.Icon.Pulse.css');
  app.import('bower_components/semantic-ui-accordion/accordion.css');
  app.import('bower_components/semantic-ui-menu/menu.css');
  app.import('bower_components/semantic-ui-checkbox/checkbox.css');
  app.import('bower_components/semantic-ui-transition/transition.css');
  app.import('bower_components/semantic-ui-icon/icon.css');
  app.import('bower_components/semantic-ui-icon/assets/fonts/icons.eot', {
    destDir: 'assets/assets/fonts/'
  });
  app.import('bower_components/semantic-ui-icon/assets/fonts/icons.svg', {
    destDir: 'assets/assets/fonts/'
  });
  app.import('bower_components/semantic-ui-icon/assets/fonts/icons.ttf', {
    destDir: 'assets/assets/fonts/'
  });
  app.import('bower_components/semantic-ui-icon/assets/fonts/icons.woff', {
    destDir: 'assets/assets/fonts/'
  });
  app.import('bower_components/semantic-ui-icon/assets/fonts/icons.woff2', {
    destDir: 'assets/assets/fonts/'
  });
  app.import('bower_components/semantic-ui-loader/loader.css');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
