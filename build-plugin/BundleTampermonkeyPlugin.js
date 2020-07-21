const path = require('path');
const url = require('url');
const deepMerge = require('deepmerge');
const { genMeta, envFileName, isEnvDevelopment } = require('./build-meta');
const loadconfig = require('./load-config');

const REGEX_T = { js: /\.js$/, css: /\.css$/ };
const PluginName = 'TampermonkeyPlugin';

const combineMerge = function (target, source, options) {
  const destination = target.slice();
  source.forEach(function (item, index) {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

function feedRequireValue(assets, requireValue, publicURL) {
  let assetsMap = new Map();
  for (const filename in assets) {
    if (REGEX_T.js.test(filename)) assetsMap = requireValue.require;
    else if (REGEX_T.css.test(filename)) assetsMap = requireValue.resource;
    else continue;
    let name = path.join(publicURL, `${filename}`);
    assetsMap.set(filename, name);
    console.info(`📦${PluginName} bundle: ${filename}`);
  }
}
function entryPointHandler(config, compilation) {
  const options = compilation.options;
  const isHttps = options.devServer ? options.devServer.https : false;
  const uri = url.parse(config.baseURL);
  const re_host = options.devServer ? options.devServer.host : uri.hostname;
  const re_port = options.devServer ? options.devServer.port : uri.port;
  const publicURL = options.output.publicURL;
  const protocol = isEnvDevelopment ? (isHttps ? 'https' : 'http') : '';
  const port = isEnvDevelopment ? re_port : '';
  const host = isEnvDevelopment ? re_host : '';
  const requireValue = {
    require: new Map(),
    resource: new Map(),
  };
  const assetsRequireConfig = { require: [], resource: [], grant: [] };
  const combineURL = (name) => {
    const prefix = isEnvDevelopment
      ? `${protocol}://${host}:${port}`
      : config.baseURL;
    const params = isEnvDevelopment ? '' : config.params;
    return `${prefix}/${name}${params}`;
  };

  console.info('');

  feedRequireValue(
    compilation.assets,
    requireValue,
    publicURL ? publicURL : ''
  );

  for (const assetsType in requireValue) {
    if (requireValue.hasOwnProperty(assetsType)) {
      const element = requireValue[assetsType];
      assetsRequireConfig[assetsType] = Array.from(element.values()).map(
        (value) => `${combineURL(value)}`
      );
    }
  }
  assetsRequireConfig.grant =
    assetsRequireConfig.resource.length !== 0
      ? ['GM_addStyle', 'GM_getResourceText']
      : [];
  const updateMetaURL = combineURL(envFileName(config));
  const updateMeta = isEnvDevelopment
    ? { updateURL: updateMetaURL, downloadURL: updateMetaURL }
    : {};

  console.info(`📦${PluginName} updateURL: ${updateMetaURL}`);

  config = deepMerge.all([config, updateMeta, assetsRequireConfig], {
    arrayMerge: combineMerge,
  });
  const filename = envFileName(config);

  const headers = genMeta(config);

  // fs.writeFileSync(requirePath, headers);
  compilation.assets[filename] = {
    source: function () {
      return headers;
    },
    size: function () {
      return headers.length;
    },
  };
  // return headers;
}

function TampermonkeyPlugin() {}

TampermonkeyPlugin.prototype.apply = function (compiler) {
  compiler.hooks.emit.tapAsync(PluginName, function (compilation, callback) {
    const config = loadconfig.sync(process.cwd());
    // console.log(Object.keys(compilation))

    entryPointHandler(config, compilation);

    callback();
  });
};

module.exports = TampermonkeyPlugin;
