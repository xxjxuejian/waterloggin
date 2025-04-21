import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 各种插件
import setupPlugins from "@/plugins";

const app = createApp(App);

// 注册所有插件
app.use(setupPlugins);
app.mount("#app");
