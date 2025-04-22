import { createApp } from "vue";
import "@/styles/index.scss";
import App from "./App.vue";

// UnoCSS
import "virtual:uno.css";

// 各种插件
import setupPlugins from "@/plugins";

// 本地SVG图标
import "virtual:svg-icons-register";

const app = createApp(App);

// 注册所有插件
app.use(setupPlugins);
app.mount("#app");
