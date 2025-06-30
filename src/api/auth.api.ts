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

  // 切换租户
  setTenant(data = {}) {
    return request({
      url: "/tenant/set",
      method: "post",
      data,
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

// 用户信息
export interface UserInfo {
  createBy?: string;
  createTime?: string;
  remark?: string;
  userId?: number;
  deptId?: number;
  userName?: string;
  nickName?: string;
  email?: string;
  phonenumber?: string;
  sex?: string;
  avatar?: string;
  password?: string;
  status?: string;
  delFlag?: string;
  loginIp?: string;
  loginDate?: string;
  dept?: Dept;
  roles?: any[];
  post?: string;
  duty?: string;
  admin?: boolean;
}

export interface Dept {
  deptId?: number;
  parentId?: number;
  ancestors?: string;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  status?: string;
  children?: Dept[];
  userList?: any[];
}
