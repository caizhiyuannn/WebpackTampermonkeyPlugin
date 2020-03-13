const path = require('path');
const fs = require('fs');
// const config = require('./config');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const isEnvDevelopment = process.env.TM_ENV
  ? process.env.TM_ENV === 'development'
  : process.env.NODE_ENV
  ? process.env.NODE_ENV === 'development'
  : false;

const envFileName = config =>
  isEnvDevelopment
    ? `${config.name.trim().replace(' ', '-')}-dev.user.js`
    : `${config.name.trim().replace(' ', '-')}-prod.user.js`;

// console.log(envConf);

const appHeaders = (meta, value) =>
  `
// @${meta}     ${value}
`.trimLeft();

// s is Set, save resource name
const parseArray = (meta, value, name = '', s) => {
  if (Array.isArray(value)) {
    const headers = value.reduce((arr, cur) => {
      if (name.trim().length !== 0) {
        const t = new Date().getTime();
        s.add(`${name + t}`);
        return arr + appHeaders(meta, `${name + t} ${cur}`);
      }
      return arr + appHeaders(meta, cur);
    }, '');

    return headers;
  }
};

const addResource = name => {
  return `GM_addStyle(GM_getResourceText('${name}'))\n`;
};

function genMeta(config) {
  let headers = '// ==UserScript==\n';
  let resources = '';
  config = Object.assign({}, config);
  delete config.baseURL;
  delete config.params;

  for (const conf in config) {
    const element =
      isEnvDevelopment && conf === 'version'
        ? `1.0.0-dev+${new Date().getTime()}`
        : config[conf];
    switch (typeof element) {
      case 'object': {
        switch (conf) {
          case 'resource':
            if (Array.isArray(element) && element.length !== 0) {
              const s = new Set();
              headers += parseArray(conf, element, 'css', s);
              s.forEach(val => (resources += addResource(val)));
            }
            break;
          default:
            if (Array.isArray(element) && element.length !== 0)
              headers += parseArray(conf, element);
            break;
        }
        break;
      }
      case 'string':
        if (element.trim().length !== 0) headers += appHeaders(conf, element);
        break;
      case 'boolean':
        if (element) headers += appHeaders(conf, '');
        break;
      default:
        break;
    }
  }
  // console.log(headers);
  headers += '// ==/UserScript==\n';
  return headers + resources;
}

module.exports = {
  envFileName,
  resolveApp,
  isEnvDevelopment,
  genMeta
};
