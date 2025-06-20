import Vue from 'vue'
import App from './App.vue'
import chroma from 'chroma-js';

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWZjOWNmNC01MzAyLTQxNWYtYWRmMC0xNmRiNDU3MGE1ZGIiLCJpZCI6MjY1NjY5LCJpYXQiOjE3NDgzMDcyNDZ9.kJqw38UmmZaJIdTeT_zDaXL3KtfJ-m83qxIN0k0chzo";
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

const result = chroma.mix('rgb(255,0,0)', 'rgb(0,255,0)', 0.5, 'hsl').rgb();
console.log(result); // 输出：[255, 255, 0]
