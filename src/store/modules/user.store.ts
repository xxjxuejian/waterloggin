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
        .then((data: any) => {
          console.log("userInfo", data);
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  return {
    login,
    getUserInfo,
  };
});

export function useUserStoreHook() {
  return useUserStore(pinia);
}
