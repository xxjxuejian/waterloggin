// 把 / 路径 改为 /monitoring,统一路径格式
export function patchRootPath(routes: any) {
  return routes.map((route: any) => {
    if (route.path === "/") {
      return {
        ...route,
        name: "monitoring",
        path: "/monitoring",
        alwaysShow: true,
        meta: {
          title: "monitoring",
          icon: "monitoring",
        },
      };
    } else {
      return {
        ...route,
        name: route.name.toLowerCase(),
      };
    }
  });
}

// 删除redirect属性
export function patchRedirect(routes: any) {
  routes.forEach((route: any) => {
    if (route.redirect) {
      // console.log("newRoutes", route.redirect);
      delete route.redirect;
    }
  });
}

// 修改component路径
export function patchComponentPath(routes: any) {
  const newRoutes = patchRootPath(routes);
  patchRedirect(newRoutes);
  patchHiddenAndAlwaysShow(newRoutes);

  const res = newRoutes.map((route: any) => {
    const topName = route.name.toLowerCase();

    const newChildren = (route.children || []).map((child: any) => {
      const originalPath = child.component;
      //   @ 无法解析,替换为 /src
      const path = originalPath.split("views")[1];
      return {
        ...child,
        component: `/src/views/${topName}` + path,
      };
    });

    return {
      ...route,
      children: newChildren,
    };
  });

  //   console.log("res", JSON.stringify(res));
  return res;
}

// 修改hidden和alwaysShow的位置
export function patchHiddenAndAlwaysShow(routes: any) {
  routes.forEach((route: any) => {
    if (route.hidden !== undefined) {
      route.meta.hidden = route.hidden;
      delete route.hidden;
    }

    if (route.alwaysShow !== undefined) {
      route.meta.alwaysShow = route.alwaysShow;
      delete route.alwaysShow;
    }

    if (route.children) {
      patchHiddenAndAlwaysShow(route.children);
    }
  });
}
