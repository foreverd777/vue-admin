import Vue from "vue";
import Vuex from "vuex";
import { Login } from "@/api/login";
Vue.use(Vuex);

import app from "./modules/app.js";
import login from "./modules/login.js";

export default new Vuex.Store({
  modules: {
    app,
    login
 }
});
