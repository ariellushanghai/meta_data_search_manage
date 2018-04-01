import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import createPersistedState from "vuex-persistedstate";
import types from "./mutations_types";
import { isEmpty, map } from "lodash";

Vue.use(Vuex);

const state = {
  user_name: "",
  seach_word: "",
  menus: []
};
const getters = {
  user_name: state => {
    return state.user_name;
  },
  seach_word: state => {
    return state.seach_word;
  }
};

const mutations = {
  [types.SAVE_USER_INFO]: (state, data) => {
    console.log(`SAVE_USER_INFO: `, data);
    state.user_name = data.userName;
    state.menus = data.list;
  },

  [types.SAVE_USER_INPUT_SEARCH]: (state, data) => {
    state.seach_word = data.seach_word;
  },

  [types.LOGOUT]: state => {
    state.user_name = "";
    state.menus = [];
  }
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  mutations,
  state,
  getters,
  plugins: [createLogger(),
    createPersistedState({ storage: window.sessionStorage })]
});
