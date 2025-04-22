import type { App } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia };
