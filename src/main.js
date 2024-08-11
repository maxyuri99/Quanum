import Vue from "vue";
import App from "./App.vue";
import i18n from "./plugins/i18n";
import router from "./router";
import store from "./store";
import VueSweetalert2 from "vue-sweetalert2";
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from "bootstrap-vue";
import "./styles/_custom.scss";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./registerServiceWorker";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(BootstrapVueIcons);
Vue.use(VueSweetalert2);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
