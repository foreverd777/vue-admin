import axios from "axios";
import { Message } from "element-ui";
import { getToKen, getUserName } from "./app";

//创建axios，赋给变量service

const BASEURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_APIP
    : "/devApi";

const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000, //超时
  //网络请求接口
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    //后台需要前端这边传相关的参数（在请求头添加参数）

    //根据业务需求添加
    config.headers["UserName"] = getUserName();
    config.headers["Tokey"] = getToKen();

    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
/**
 * 请求接口后，返回数据进行拦截
 */
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    let data = response.data;
    //添加业务需求

    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;

/**
 * 使用export default时，
 * 文件import不需要花括号，
 * 但不能同时存在多个default
 */
