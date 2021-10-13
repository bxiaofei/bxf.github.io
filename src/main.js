import Vue from 'vue'
import './common/'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//复制粘贴插件
import VueClipboard from 'vue-clipboard2'
import 'font-awesome/scss/font-awesome.scss'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueClipboard);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
