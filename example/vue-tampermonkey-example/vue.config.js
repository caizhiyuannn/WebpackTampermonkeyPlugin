// vue.config.js

const TampermonkeyPlugin = require('webpack-tampermonkey-plugin');

module.exports = {
  devServer: {
    clientLogLevel: 'none',
    quiet: false
  },
  configureWebpack: {
    plugins: [new TampermonkeyPlugin()],
  },
};
