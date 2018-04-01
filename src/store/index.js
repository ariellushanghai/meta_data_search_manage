import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import createPersistedState from "vuex-persistedstate";
import types from "./mutations_types";
import * as actions from "./actions";
import { isEmpty, map } from "lodash";

Vue.use(Vuex);

const state = {
  user_name: "",
  menus: []
};
const getters = {
  user_name: state => {
    return state.user_name;
  }
};

const mutations = {
  [types.SAVE_USER_INFO]: (state, data) => {
    console.log(`SAVE_USER_INFO: `, data);
    state.user_name = data.userName;
    state.menus = data.list;
  },
  [types.LOGOUT]: state => {
    state.user_name = "";
    state.menus = [];
  }
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  // actions,
  mutations,
  state,
  getters,
  plugins: [createLogger(),
    createPersistedState({ storage: window.sessionStorage })]
});
