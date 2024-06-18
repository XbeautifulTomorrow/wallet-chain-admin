import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/common.css";
import * as Fetch from "@/service/fetch";
import selfFunc from "@/utils/common";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import contract from "./utils/global.contract.js";

Vue.use(ElementUI);

Vue.prototype.$http = Fetch;

Vue.prototype.$selfFunc = selfFunc;

Vue.config.productionTip = false;
Vue.prototype.$contract = new contract();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
