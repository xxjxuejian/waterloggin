import { defineStore } from "pinia";
import { pinia } from "@/store";

import AuthAPI, { type LoginFormData } from "@/api/auth.api.ts";
import { setToken } from "@/utils/auth.ts";

export const useUserStore = defineStore("user", () => {
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
    return new Promise((resolve, reject) => {
      AuthAPI.getUserInfo()
        .then((res: any) => {
          console.log("userInfo", JSON.stringify(res));
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
  return {
    login,
    getUserInfo,
    getRoutes,
  };
});

export function useUserStoreHook() {
  return useUserStore(pinia);
}
