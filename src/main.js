import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false    // 阻止显示显示生产模式的消息


Vue.use(ElementUI);


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})
