import i18n from "@/lang/index";

// 判断是否存在国际化配置，如果没有原生返回,只针对侧边栏的一个函数
export function translateRouteTitle(title: any) {
  const hasKey = i18n.global.te("sidebar." + title);
  if (hasKey) {
    return i18n.global.t("sidebar." + title);
  }
  return title;
}
