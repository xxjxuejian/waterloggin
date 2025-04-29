import request from "@/utils/request";

const AuthAPI = {
  /* 
  登录
  */
  login: (data: LoginFormData) => {
    return request({
      url: "/login",
      method: "POST",
      data,
    });
  },

  /** 获取用户信息 */
  getUserInfo: () => {
    return request({
      url: "/getInfo",
      method: "get",
    });
  },

  /** 退出登录 */
  logout: () => {
    return request({
      url: "/logout",
      method: "get",
    });
  },

  /** 获取用户菜单(路由)列表 */
  getRoutes: () => {
    return request({
      url: "/getRouters",
      method: "get",
    });
  },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 记住我 */
  rememberMe: boolean;
}
