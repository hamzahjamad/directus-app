import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  REFRESH_TOKEN,
  REMOVE_AUTH_ERROR,
  CHANGE_API,
  SWITCH_PROJECT
} from "../../mutation-types";

const mutations = {
  [LOGIN_PENDING](state) {
    state.loading = true;
  },

  [LOGIN_SUCCESS](state, info) {
    state.loading = false;
    state.error = null;
    state.token = info.token;
    state.project = info.project;
    state.url = info.url;
    state.projectName = info.projectName;
  },

  [LOGIN_FAILED](state, error) {
    state.token = null;
    state.url = null;
    state.project = null;
    state.projectName = null;
    state.loading = false;
    state.error = error;
  },

  [LOGOUT](state, error) {
    state.error = error;
  },

  [REFRESH_TOKEN](state, info) {
    state.loading = false;
    state.error = null;
    state.token = info.token;
    state.project = info.project;
    state.url = info.url;
  },

  [REMOVE_AUTH_ERROR](state) {
    state.error = null;
  },

  [CHANGE_API](state, { url, project }) {
    state.url = url;
    state.project = project;
  },
  [SWITCH_PROJECT](state, obj) {
    state.project = obj.project ? obj.project : null;
    state.url = obj.url ? obj.url : null;
    state.projectName = obj.projectName;
    // @todo check for and enable usage of static or SSO token
    state.token = null;
  }
};

export default mutations;
