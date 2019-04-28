import jwtPayload from "@rijk/jwt-payload";
import { mapKeys } from "lodash";
import formatTitle from "@directus/format-title";
import { i18n } from "../../../lang/";
import api from "../../../api";
import router from "../../../router";
import { resetState } from "../../index";
import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REFRESH_TOKEN,
  REMOVE_AUTH_ERROR,
  LOGOUT,
  CHANGE_API,
  SWITCH_PROJECT
} from "../../mutation-types";
import { stopPolling } from "../../../polling";

const config = window.__DirectusConfig__; // eslint-disable-line
const urls = config
  ? mapKeys(config.api, (val, key) => (key.endsWith("/") ? key : key + "/"))
  : null;

function extractHostname(url) {
  let hostname;

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];

  return hostname;
}

export function login({ commit }, credentials) {
  commit(LOGIN_PENDING);

  const { url } = credentials;
  let formattedUrl = url;

  if (formattedUrl.endsWith("/") === false) {
    formattedUrl += "/";
  }

  if (formattedUrl.startsWith("http") === false) {
    const link = document.createElement("a");
    link.href = formattedUrl;
    formattedUrl = link.href;
  }

  const parts = formattedUrl.split("/");
  const project = parts.pop() || parts.pop();
  const newUrl = parts.join("/");

  return api
    .login({
      ...credentials,
      url: newUrl,
      project,
      persist: true
    })
    .then(info => {
      commit(LOGIN_SUCCESS, {
        ...info,
        projectName:
          urls[url] ||
          urls[info.url + "/" + info.project + "/"] ||
          formatTitle(extractHostname(info.url))
      });
    })
    .catch(error => {
      commit(LOGIN_FAILED, error);
      throw error;
    });
}

export function loginSSO({ commit }, request_token) {
  commit(LOGIN_PENDING);

  const { url, project } = jwtPayload(request_token);
  api.url = url;
  api.project = project;

  return api
    .request(
      "POST",
      "auth/sso/access_token",
      {},
      {
        request_token
      }
    )
    .then(res => res.data)
    .then(({ token }) => {
      api.token = token;
      api.localExp = new Date(Date.now() + 5 * 60000).getTime();
      commit(LOGIN_SUCCESS, {
        project: project,
        url,
        token,
        projectName: config.api[url] || extractHostname(url)
      });
    });
}

export function refresh({ commit }, { token, url, project }) {
  commit(REFRESH_TOKEN, { token, url, project });
}

export function logout({ commit }, error) {
  return new Promise(resolve => {
    stopPolling();
    api.reset();
    resetState();
    i18n.locale = "en-US";
    router.push("/login");
    commit(LOGOUT, error);
    resolve();
  });
}

export function switchProject({ commit }, obj) {
  commit(SWITCH_PROJECT, obj);
}

export function changeAPI({ commit, dispatch }, url) {
  dispatch("logout").then(() => {
    const parts = url.split("/");
    const project = parts.pop() || parts.pop();
    const newUrl = parts.join("/");
    commit(CHANGE_API, { url: newUrl, project });
  });
}

export function removeAuthError({ commit }) {
  commit(REMOVE_AUTH_ERROR);
}

export function clearAuth({ commit }) {
  commit(LOGOUT);
}
