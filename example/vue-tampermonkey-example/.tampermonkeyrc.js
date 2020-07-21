module.exports = {
  name: 'vue-tampermonkey-example',
  version: '1.0.0',
  description: 'xxx',
  // 同tampermonkey
  author: 'caizhiyuannn',
  // 同tampermonkey
  namespace: '',
  // 填入自动检查更新的URL
  updateURL: 'http://localhost:8080/vue-tampermonkey-example.user.js',
  // 下载更新文件的URL
  downloadURL: 'http://localhost:8080/vue-tampermonkey-example.user.js',
  match: [
    // 匹配站点用于加载油猴脚本
    '*://*',
  ],
  connect: [
    // 允许跨域访问的 站点
    'github.com',
  ],
  require: [
    // 需要加载的一些工具包
    'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js',
  ],
  grant: [
    // 授权API
    'GM_getValue',
    'GM_setValue',
    'GM_notification',
    'GM_xmlhttpRequest',
  ],
  environment: {
    production: {
      // 生产环境配置的URL环境，指定存储静态文件的baseURL，脚本自动会在每个需要加载的文件添加baseURL前缀。
      // params 为后缀
      // 一些需要auth_code 可以用此方式让油猴能正常访问到文件
      // 最终require 会以 http://github.com/app.js?auth_code=xxx  这种形式
      other: {
        baseURL: 'http://github.com',
        params: '',
      },
    },
    development: {
      // 开发环境指定的参数。有些cli工具可能没有暴露devServer host ，port ，需要手动指定baseURL
      other: {
        baseURL: 'http://localhost:8080',
      },
    },
  },
};
