import type { App } from "vue";
import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/store/modules/app.store.ts";

const appStore = useAppStoreHook();

// 本地语言包
import zhCn from "./package/zh-cn";
import en from "./package/en";

// appStore.language的值要和 这个对象的key一样
const messages = {
  "zh-cn": {
    ...zhCn,
  },
  en: {
    ...en,
  },
};

//  i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 可以全局使用 $t
  locale: appStore.language, // 默认语言
  fallbackLocale: "en", // 回退语言
  messages,
});

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
