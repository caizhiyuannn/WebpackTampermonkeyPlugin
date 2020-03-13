'use strict';

const resolve = require('path').resolve;

const main = require('./main');

const { cosmiconfig, cosmiconfigSync } = require('cosmiconfig');

const tampermonkeyResult = result => {
  let config = result.config || {};

  if (typeof config === 'object') {
    config = Object.assign({}, config);
  }

  return {
    ...main(config)
  };
};

const rc = path => {
  path = path ? resolve(path) : process.cwd();
  return cosmiconfig('tampermonkey')
    .search(path)
    .then(result => {
      if (!result) {
        throw new Error(`No tampermonkey config found in: ${process.cwd}`);
      }
      return tampermonkeyResult(result);
    });
};

rc.sync = path => {
  path = path ? resolve(path) : process.cwd();
  const result = cosmiconfigSync('tampermonkey').search(process.cwd());

  if (!result) {
    throw new Error(`No tampermonkey config found in: ${process.cwd}`);
  }
  return tampermonkeyResult(result);
};

module.exports = rc;
