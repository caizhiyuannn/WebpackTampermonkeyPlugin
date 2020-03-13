'use strict';
const deepmerge = require('deepmerge');
const environment = require('./environment');
const { TMKEYWORDS } = require('../constants');

const main = config => {
  let _main = {};
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    Object.keys(config).forEach(key => {
      switch (key) {
        case TMKEYWORDS.name:
        case TMKEYWORDS.version:
        case TMKEYWORDS.author:
        case TMKEYWORDS.description:
        case TMKEYWORDS.namespace:
        case TMKEYWORDS.homepage:
        case TMKEYWORDS.homepageURL:
        case TMKEYWORDS.website:
        case TMKEYWORDS.source:
        case TMKEYWORDS.icon:
        case TMKEYWORDS.icon64:
        case TMKEYWORDS.defaulticon:
        case TMKEYWORDS.updateURL:
        case TMKEYWORDS.downloadURL:
        case TMKEYWORDS.supportURL:
        case TMKEYWORDS.runat:
        case TMKEYWORDS.nocompat:
          if (typeof config[key] === 'string') break;
        case TMKEYWORDS.include:
        case TMKEYWORDS.exclude:
        case TMKEYWORDS.match:
        case TMKEYWORDS.require:
        case TMKEYWORDS.resource:
        case TMKEYWORDS.connect:
        case TMKEYWORDS.grant:
          if (Array.isArray(config[key])) break;
        case TMKEYWORDS.noframes:
        case TMKEYWORDS.unwrap:
          if (typeof config[key] === 'boolean') break;
        default:
          return;
      }
      _main[key] = config[key];
    });
    _main = deepmerge(_main, environment(config.environment));
  }
  return _main;
};

module.exports = main;
