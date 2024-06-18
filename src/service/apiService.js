import config from "@/config/env";
import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";

let baseUrl = config.api;
let axiosConfig = {
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
};
var instance = axios.create(axiosConfig);


var service = {
  //  与服务器进行post交互
  async post(api, sendData) {
    let token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers["certificate"] = token;
    } else {
      instance.defaults.headers["verify"] = localStorage.getItem('verify');
    }
    sendData = sendData || {};
    for (var key in sendData) {
      if (sendData.hasOwnProperty(key)) {
        var element = sendData[key];
        if (element === "") {
          delete sendData[key];
        }
      }
    }
    let promise = new Promise(function (resolve, reject) {
      instance
        .post(api, sendData)
        .then((response) => {

          if (response && response.status === 200) {
            if (response.headers.certificate) {
              sessionStorage.setItem("token", response.headers.certificate);
            }

            const { data } = response;
            if (Number(data.code) === 200) {
              resolve(data.data || true);
            } else if (Number(data.code) === 401) {
              Message.error(data.message || data.data || data.msg);
              sessionStorage.removeItem("token");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              Message.error(data.message || data.data || data.msg);
              resolve(false);
            }
          } else if (!response) {
            Message.error("请求超时，请稍后再试.");
            resolve(false);
          } else {
            Message.error("请求失败");
            resolve(false);
          }
        })
        .catch((error) => {
          console.log("error:", error);
          resolve(false);
        });
    });
    return promise;
  },
  async get(api, sendData) {
    let token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers["certificate"] = token;
    }
    sendData = sendData || {};
    for (var key in sendData) {
      if (sendData.hasOwnProperty(key)) {
        var element = sendData[key];
        if (element === "") {
          // delete sendData[key];
        }
      }
    }
    let promise = new Promise(function (resolve, reject) {
      instance
        .get(api, {
          params: sendData,
        })
        .then((response) => {
          if (response && response.status === 200) {
            let data = response.data;
            if (Number(data.code) === 200) {
              resolve(data.data || true);
            } else if (Number(data.code) === 401) {
              Message.error(data.message || data.data || data.msg);
              sessionStorage.removeItem("token");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              Message.error(data.message || data.data || data.msg);
              resolve(false);
            }
          } else if (!response) {
            Message.error("请求超时，请稍后再试.");
            resolve(false);
          } else {
            Message.error("请求失败");
            resolve(false);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });

    return promise;
  },
};

export default service;
