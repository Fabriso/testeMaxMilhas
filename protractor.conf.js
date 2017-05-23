'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

exports.config = {
  capabilities: {
    'browserName': 'safari'
  },

  baseUrl: 'http://localhost:3000',

  specs: [paths.e2e + '/**/*.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
