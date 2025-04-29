// 注册所有插件
import type { App } from "vue";
import { setupElIcons } from "./icons";
import { setupStore } from "@/store";
import { setupRouter } from "@/router";
import { setupPermission } from "./permission";

// 自定义的插件，默认导出一个对象，内部有一个install方法
export default {
  install(app: App<Element>) {
    // Element-plus图标
    setupElIcons(app);

    // 路由
    setupRouter(app);

    // 状态管理(pinia)
    setupStore(app);

    // 路由守卫
    setupPermission();
  },
};
