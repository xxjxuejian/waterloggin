import { defineStore } from "pinia";
import { pinia } from "@/store";

import AuthAPI, { type LoginFormData, type UserInfo } from "@/api/auth.api.ts";
import { setToken, clearToken } from "@/utils/auth.ts";

export const useUserStore = defineStore("user", () => {
  // 1. 定义了一个响应式变量叫做userInfo,初始值是{}
  // 2.这个变量会自动地保存到浏览器的 localStorage中，key叫做userInfo
  // 3.每次改动 userInfo 的值，它都会自动写入 localStorage
  // 4.页面刷新后，它会从 localStorage 读取已有值自动恢复。
  const userInfo = useStorage<UserInfo>("userInfo", {} as UserInfo);

  // 初始化租户中心经纬度
  const initCenter = ref({
    lon: 120.3,
    lat: 30.43,
  });
  // 登录
  function login(LoginFormData: LoginFormData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(LoginFormData)
        .then((data: any) => {
          console.log("login,store", data);
          const { token } = data;
          setToken(token);
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  //   获取用户信息
  function getUserInfo() {
    // 类型
    return new Promise<UserInfo>((resolve, reject) => {
      AuthAPI.getUserInfo()
        .then((res: any) => {
          if (!res) {
            reject("Verification failed, please Login again.");
            return;
          }
          // console.log("userInfo", res.user);
          // res:code,msg,permission,roles,user . 没有data属性,user中是用户信息
          Object.assign(userInfo.value, { ...res.user });
          resolve(res.user);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // 获取用户菜单(路由)列表
  function getRoutes() {
    // 类型
    return new Promise((resolve, reject) => {
      AuthAPI.getRoutes()
        .then((res: any) => {
          // console.log("getRoutes", res);
          resolve(res.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // 退出登录
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          // 清除token信息
          clearToken();
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
  return {
    login,
    logout,
    userInfo,
    getUserInfo,
    getRoutes,
    initCenter,
  };
});

export function useUserStoreHook() {
  return useUserStore(pinia);
}
