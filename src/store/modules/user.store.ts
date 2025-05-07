import { defineStore } from "pinia";
import { pinia } from "@/store";

import AuthAPI, { type LoginFormData } from "@/api/auth.api.ts";
import { setToken, clearToken } from "@/utils/auth.ts";

export const useUserStore = defineStore("user", () => {
  // const userInfo = ref({});

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
    return new Promise((resolve, reject) => {
      AuthAPI.getUserInfo()
        .then((res: any) => {
          console.log("userInfo", res);
          // res没有data属性
          resolve(res);
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
    getUserInfo,
    getRoutes,
  };
});

export function useUserStoreHook() {
  return useUserStore(pinia);
}
