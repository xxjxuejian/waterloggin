import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { getToken, isTokenExpired, clearToken } from "@/utils/auth";
import router from "@/router";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 1000 * 10,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  paramsSerializer: (params) => qs.stringify(params),
});

// 请求拦截器
const whiteList = ["/login", "/register"];

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 请求拦截器中 判断是否存在token,并添加到请求头 Authorization 中
    // 逻辑代码,获取token，检查是否过期
    const token = getToken();

    // 这里不考虑token是否过期，在响应拦截器中处理
    const isExpire = isTokenExpired();

    // 能获取到token的情况
    if (token) {
      if (!isExpire) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } else {
        console.log("token过期，跳转到登录页面");
        clearToken();
        router.push("/login");
        return Promise.reject(new Error("token过期"));
      }
    }
    // 获取不到token情况
    else {
      if (whiteList.some((url) => config.url?.startsWith(url))) {
        return config; // 白名单放行
      } else {
        console.log("未登录，跳转到登录页面");
        router.push("/login");
        return Promise.reject(new Error("未登录"));
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  /* 
  HTTP状态码，2xx  或 3xx 范围内的状态码都会触发该函数。
  服务器成功返回了响应（HTTP 状态码为 2xx 或 3xx）就会触发，即使业务上是失败的(指后端)
  */
  (response: AxiosResponse) => {
    // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, msg } = response.data;
    // 后端返回的code 状态码
    if (code === 200) {
      return response.data;
    } else if (code === 401) {
      ElMessage.warning("登录过期，请重新登录");
      // 登出，回到登录页面
      clearToken();
      router.push("/login");
      // 手动抛出异常, 中断请求链。
      return Promise.reject(new Error("登录过期"));
    } else {
      // 业务失败（后端返回 code 非 200）
      ElMessage.error(msg || "请求失败");
      return Promise.reject(new Error(msg || "Error")); // 手动抛出异常
    }
  },

  // HTTP 层面错误处理（超时、401、500 等），  超过200状态码的会触发这个函数，
  (err) => {
    console.error("request error", err); // for debug

    const { response } = err;
    if (response) {
      ElMessage.error(err.message || "系统出错");
    }

    return Promise.reject(err);
  }
);

export default instance;
