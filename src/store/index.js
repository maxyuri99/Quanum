import Vuex from "vuex";
import Vue from "vue";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

let vuexStore = null;
let vuexLocalStorage = null;

const getDefaultState = () => {
  return {
    token: null,
    user: {
      id: null,
      email: null,
      firstname: null,
      lastname: null,
      occupation_role: null,
      type: null,
      avatar_url: null,
    },
    userTypes: {
      lastUpdate: null,
      list: [],
    },
    usersToBeAuditors: {
      lastUpdate: null,
      list: [],
    },
    auditTypes: {
      lastUpdate: null,
      list: [],
    },
    language: null,
    audits: {
      lastUpdate: null,
      list: [],
    },
  };
};

const state = getDefaultState();

const mutations = {
  SET_AUDIT_TYPES(state, { auditTypes }) {
    state.auditTypes = auditTypes;
  },
  SET_USERS_TO_BE_AUDITORS(state, { usersToBeAuditors }) {
    state.usersToBeAuditors = usersToBeAuditors;
  },
  SET_DEFAULT_STATE(state) {
    // https://stackoverflow.com/questions/42295340/how-to-clear-state-in-vuex-store
    // Merge rather than replace so we don't lose observers
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState());
  },
  SET_LOGGED_USER(state, { user }) {
    state.user = user;
  },
  UNSET_LOGGED_USER(state) {
    state.user = {
      id: null,
      email: null,
      firstname: null,
      lastname: null,
      occupation_role: null,
      type: null,
      avatar_url: null,
    };
  },
  SET_LANGUAGE(state, { language }) {
    state.language = language;
  },
  SET_AUDITS(state, { audits }) {
    state.audits = audits;
  },
  SET_USER_TYPES(state, { userTypes }) {
    state.userTypes = userTypes;
  },
  SET_TOKEN(state, { token }) {
    state.token = token;
  },
  UNSET_TOKEN(state) {
    state.token = null;
  },
};

const actions = {
  setUser({ commit }, user) {
    commit("SET_LOGGED_USER", {
      user,
    });
  },
  setUserAndToken({ commit }, userAndtoken) {
    var user = userAndtoken.user;
    var token = userAndtoken.token;

    commit("SET_LOGGED_USER", {
      user,
    });
    commit("SET_TOKEN", {
      token,
    });
  },
  logout({ commit }) {
    commit("UNSET_LOGGED_USER");
    commit("UNSET_TOKEN");
  },
  setLanguage({ commit }, language) {
    commit("SET_LANGUAGE", {
      language,
    });
  },
  setAudits({ commit }, audits) {
    commit("SET_AUDITS", {
      audits,
    });
  },
  setUserTypes({ commit }, userTypes) {
    commit("SET_USER_TYPES", {
      userTypes,
    });
  },
  setDefaultState({ commit }) {
    commit("SET_DEFAULT_STATE");
  },
  setUsersToBeAuditors({ commit }, usersToBeAuditors) {
    commit("SET_USERS_TO_BE_AUDITORS", { usersToBeAuditors });
  },
  setAuditTypes({ commit }, auditTypes) {
    commit("SET_AUDIT_TYPES", { auditTypes });
  },
};

const getters = {
  loggedUser: (state) => Boolean(state?.token),
};

vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
});

vuexStore = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state,
  mutations,
  actions,
  getters,
});

export default vuexStore;
