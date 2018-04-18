import axios from "axios";
import queryString from "query-string";
import store from "@/store";
import { loginURL, baseURL } from "@/conf/env"; // "http://localhost:8080/api"
import { extend, isEmpty } from "lodash";


// console.log(`generated baseURL: `, `${baseURL}?${queryString.stringify(parsedUrl.query)}`);

// axios.defaults.baseURL = isEmpty(parsedUrl.query) ? `${baseURL}/api` : `${baseURL}?${queryString.stringify(parsedUrl.query)}/api`;

axios.defaults.baseURL = `${baseURL}`;
axios.defaults.headers.common["Cache-Control"] = "no-cache";
axios.defaults.headers.common["Pragma"] = "no-cache";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";


axios.interceptors.request.use(
  config => {
    let parsedUrl = queryString.parseUrl(location.hash);
    // console.log(`parsedUrl: `, parsedUrl);
    // console.log(`config: `, config);
    config.validateStatus = function(status) {
      return Number(status) === 200;
    };
    config.params = parsedUrl.query.tk ? extend(config.params, parsedUrl.query) : config.params;
    // console.log(`config(modified): `, config);
    return config;
  },
  err => {
    console.error("request.err: ", err);
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  res => {
    // console.log(`interceptors res: `, res);
    // debugger;
    if (Number(res.status) === 200 && res.data) {
      if (Number(res.data.errcode) === 0) {
        return res.data.data;
      } else if (Number(res.data.errcode) === 400) {
        console.error("未登陆: ", res.data);
        Promise.reject(res.data.errmsg);
        store.commit("LOGOUT");
        console.log(`${res.data.tipmsg}?url=${encodeURIComponent(location.href)}`);
        return location.replace(`${res.data.tipmsg}?url=${encodeURIComponent(location.href)}`);
      } else {
        return Promise.reject(res.data);
      }
    } else if (Number(res.status) === 401) {
      console.error("未登陆", res);
      store.commit("LOGOUT");
      location.replace(loginURL + encodeURIComponent(location.href));
      return Promise.reject(res);
    } else {
      console.error("response: ", res);
      return Promise.reject(res);
    }
  },
  err => {
    console.log("response.err: ", JSON.stringify(err));
    if (err.response.data) {
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err.response);
  }
);

export { axios as default };
