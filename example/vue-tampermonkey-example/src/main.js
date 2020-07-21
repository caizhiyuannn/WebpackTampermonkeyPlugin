import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// 油猴需要通过js 方式插入 app， 而不是通过index.html， 注意index.html 是没有的
// <div id="app"></div>
const DOMID = document.createElement('div');
DOMID.id = 'app';
document.body.appendChild(DOMID);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
