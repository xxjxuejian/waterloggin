import type { RouteRecordRaw } from "vue-router";
import router from "@/router";
import { getToken, clearToken, isTokenExpired } from "@/utils/auth.ts";
import { usePermissionStoreHook } from "@/store/modules/permission.store.ts";

export function setupPermission() {
  // 白名单路由
  // const whiteList = ["/login", "/district-monitoring"];
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {
    console.log("to", to);
    // 获取token
    const token = getToken();
    const isExpire = isTokenExpired();

    // 判断是否登录
    if (token && !isExpire) {
      // 判断是否需要重定向
      if (to.path === "/login") {
        next({ path: "/" });
      } else {
        // 去其它页面,就要判断动态路由有没有注册完成
        const permissionStore = usePermissionStoreHook();
        if (permissionStore.isRoutesLoaded) {
          next();
          // 这个触发了无限重定向,这是重新进行一次新的导航，会再次触发路由守卫，但是我们应该是直接放行。
          // next({ ...to, replace: true });
        }
        // 路由没有注册完成，则生成路由
        else {
          try {
            // 生成动态路由
            const dynamicRoutes = await permissionStore.generateRoutes();
            // 注册动态路由
            dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
            // 重新尝试当前的导航，next()好像也可以
            next(to);
          } catch (error) {
            // 路由加载失败，重置 token 并重定向到登录页
            console.error(error);
            clearToken();
            next({ path: "/login" });
          }
        }
      }
    }
    // 没有token,则跳转到登录页面
    else {
      console.log(222);
      // 未登录，判断是否在白名单中
      if (whiteList.includes(to.path)) {
        next();
      } else {
        // 不在白名单，重定向到登录页
        clearToken();
        next({ path: "/login" });
      }
    }
  });
}
