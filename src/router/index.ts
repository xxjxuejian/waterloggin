import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  /* 
    系统启动肯定是从 / 路径进入的, 直接显示大屏,后端不能再给一个 / 路径了
    如果再给一个 / , 只处理  / 的children , 添加为 / 的children
  */
  {
    path: "/",
    name: "root",
    redirect: "/district-monitoring",
    meta: { hidden: true },
  },

  {
    path: "/district-monitoring",
    name: "DistrictMonitoring",
    component: () => import("@/views/district-monitoring/index.vue"),
    meta: { title: "大屏页", icon: "screen", affix: true },
  },

  {
    path: "/:pathMatch(.*)",
    component: () => import("@/views/error/404.vue"),
    meta: {
      hidden: true,
    },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
