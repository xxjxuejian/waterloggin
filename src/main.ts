import { createApp } from "vue";
import "@/styles/index.scss";

// UnoCSS
import "virtual:uno.css";

// 各种插件
import setupPlugins from "@/plugins";

// App.vue中使用了pinia,确保了 Pinia 在 App.vue 使用之前就已经初始化完成
import App from "./App.vue";

// 本地SVG图标
import "virtual:svg-icons-register";

const app = createApp(App);

// 注册所有插件
app.use(setupPlugins);

// 挂载应用
app.mount("#app");
