import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api";
import "./router/premit"
//自定义全局方法
//import global from "./utils/global.js"
//自定义全局组件
import "./icons/index.js";
Vue.use(global);
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

//runtime（运行模式）
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
