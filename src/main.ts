import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLogger from 'vuejs-logger';



const isProduction = process.env.NODE_ENV === 'production';

const options = {
  isEnabled: true,
  logLevel : isProduction ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

// @ts-ignore
Vue.use(VueLogger, options);


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

export const VUE_APP_PROX = process.env.VUE_APP_PROX;