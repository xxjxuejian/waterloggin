import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// 引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// 图标icon自动导入
// import Icons from "unplugin-icons/vite";
// import IconsResolver from "unplugin-icons/resolver";

const pathSrc = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": pathSrc,
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    // 用来自动导入函数的
    AutoImport({
      // 导入 Vue 函数，如：ref, reactive, toRef 等
      imports: ["vue"],

      resolvers: [
        // 导入 Element Plus函数，如：ElMessage, ElMessageBox 等
        // 比如代码中使用 ElMessage.success() 时，会自动导入 ElMessage
        ElementPlusResolver({ importStyle: "sass" }),
      ],

      eslintrc: {
        enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
        filepath: "./.eslintrc-auto-import.json", // 指定自动导入函数 eslint 规则的文件
        globalsPropValue: true,
      },
      vueTemplate: true, //允许在 .vue 模板中使用自动导入的函数
      // 导入函数TS类型声明文件路径
      //  dts: false,
      dts: "src/types/auto-imports.d.ts", // 指定自动导入函数TS类型声明文件路径
    }),

    // 自动注册并导入组件
    Components({
      resolvers: [
        // 导入 Element Plus 组件，比如代码中使用组件 el-table等时，会自动导入
        ElementPlusResolver({ importStyle: "sass" }),

        // 自动注册图标组件
        // IconsResolver({
        //   prefix: "Icon", // 自定义前缀
        //   enabledCollections: ["ep"], // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
        // }),
      ],

      // 指定自定义组件位置(默认:src/components)
      dirs: ["src/components", "src/**/components"],
      // 导入组件类型声明文件路径 (false:关闭自动生成)
      //  dts: false,
      dts: "src/types/components.d.ts", // 指定自动导入组件TS类型声明文件路径
    }),
    // Icons({
    //   autoInstall: true,
    // }),
  ],
});
