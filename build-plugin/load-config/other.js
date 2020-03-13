'use strict';

const other = config => {
  let other = {};
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    Object.keys(config).forEach(key => {
      switch (key) {
        case 'baseURL':
        case 'params':
          if (typeof config[key] === 'string') break;
        default:
          return;
      }
      other[key] = config[key];
    });
  }

  return other;
};

module.exports = other;
