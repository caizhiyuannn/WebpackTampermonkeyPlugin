# webpack-tampermonkey-plugin

create tampermonkey meta

## .tampermonkey-config.js config

keywords reference https://www.tampermonkey.net/documentation.php

```js
module.exports = {
  name: 'project name',
  version: '1.0.0',
  description: 'xxx',
  author: 'xxxx',
  namespace: '',
  updateURL: 'xx.com/xx.meta.js',
  match: ['*://xx.com/*'],
  connect: ['xx.com'],
  require: [],
  grant: ['GM_getValue', 'GM_setValue', 'GM_notification', 'GM_xmlhttpRequest'],
  configurations: {
    production: {
      baseURL: 'http://xx.com',
      suffixParms: '?auth_code=xxxx'
    },
    development: {
      // assign local server address
      baseURL: 'http://127.0.0.1:1234',
      // option
      suffixParms: '?auth_code=xxxx'
    }
  }
};
```

## TM_ENV=production or TM_ENV=development Different environment

```json
// package.json#scripts
  "scripts": {
    "start": "npm run watch",
    "build": "TM_ENV=production webpack",
    "watch": "TM_ENV=development webpack"
  },
```
