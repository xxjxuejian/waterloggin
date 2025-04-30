import { pinia } from "@/store";
import i18n from "@/lang/index";

export const useAppStore = defineStore("app", () => {
  // 系统标题
  const systemTitle = ref("城市内涝预警系统");

  // 默认语言
  const language = ref("zh-cn");

  // 是否收缩侧边栏
  const isSidebarCollapse = ref(false);

  // 切换侧边栏
  const toggleSidebar = () => {
    isSidebarCollapse.value = !isSidebarCollapse.value;
  };

  // 展开侧边栏
  const expandSidebar = () => {
    isSidebarCollapse.value = false;
  };

  // 收缩侧边栏
  const collapseSidebar = () => {
    isSidebarCollapse.value = true;
  };

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language.value === "zh-cn" ? "en" : "zh-cn";
    language.value = newLang;
    // 切换以后要更新i18n 实例的locale值
    i18n.global.locale.value = newLang;
  };

  return {
    systemTitle,
    language,
    toggleLanguage,
    isSidebarCollapse,
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */

export function useAppStoreHook() {
  return useAppStore(pinia);
}
