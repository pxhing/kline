// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from "vant"
import "../node_modules/vant/lib/index.css"
require('./mock.js')
import 'lib-flexible' //rem转换
import store from '../src/store/index'
import echarts from 'echarts' //k线图


import {
  Lazyload
} from 'vant';
import {
  Toast
} from 'vant';
Toast.setDefaultOptions({
  duration: 1000
}); //设置提示时间
Vue.use(Vant);
import {
  Dialog
} from 'vant';
Vue.use(Dialog);
Vue.use(Lazyload, '');
Vue.use(Toast);


function jiequ(str) { //截取小数点后两位
	if (String(str).indexOf(".") > -1) {
		var temp = Number(str);
		temp = Math.floor(temp * 1000) / 1000;
		temp = temp.toFixed(3);
		return temp
	} else {
		return str
	}
}

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$jq = jiequ;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

//添加全局过滤器
Vue.filter('getYMD', function (input) {
  return input.split(' ')[0];
})
