import * as Cesium from "cesium";

const billboardImages = [
  "/cesium-icons/texture/map_normal.png",
  "/cesium-icons/texture/map_limitWarn.png",
  "/cesium-icons/texture/map_warn.png",
  "/cesium-icons/texture/map_warn.png",
];

export function useCesiumEntities() {
  // 保存所有的隧道站点实体
  const tunnelEntities: Cesium.Entity[] = [];
  // const limitWarnTunnel: Cesium.Entity[] = [];
  // const warnTunnel: Cesium.Entity[] = [];
  // const normalTunnel: Cesium.Entity[] = [];

  // 在地图上添加图标实体
  function addTunnelEntities(viewer: Cesium.Viewer, data: Array<any>) {
    if (!viewer || !Array.isArray(data)) return;
    data.forEach((item) => {
      const { lon, lat, name } = item;
      // if (!lon || !lat) return; // 值是 0 会被误判为
      if (lon === undefined || lat === undefined || lon === null || lat === null) return;

      //   地图上添加的坐标都是三位笛卡尔坐标系
      const position = Cesium.Cartesian3.fromDegrees(parseFloat(lon), parseFloat(lat));

      const entity = viewer.entities.add({
        name,
        position,
        billboard: {
          image: billboardImages[item.statusSec],
          width: 40,
          height: 50,
          //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 1.0,
        },
        // 在实体的 position 位置上方显示白色字体、黑色描边的文字标签。
        label: {
          text: name,
          font: "14px sans-serif",
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -40),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
        },
        // 存储自定义的键值对
        properties: {
          statusSec: item.statusSec, // 添加类型，用于筛选
          type: "tunnel", // 实体类型，表示这个实体是tunnel站点
        },
      });
      tunnelEntities.push(entity);
    });
    flyToEntities(viewer, tunnelEntities);
  }

  // 显示全部tunnel
  function showAllTunnel(viewer: Cesium.Viewer) {
    if (tunnelEntities.length === 0) return;
    tunnelEntities.forEach((entity) => {
      entity.show = true;
    });
    flyToEntities(viewer, tunnelEntities);
  }

  // 根据添加显示指定status的tunnel
  function showTunnelByStatus(viewer: Cesium.Viewer, statusSec: number) {
    if (tunnelEntities.length === 0) return;
    // 全部隐藏
    tunnelEntities.forEach((entity) => {
      entity.show = false;
    });
    // 获取指定status的tunnel
    const entities = tunnelEntities.filter((entity) => {
      if (entity.properties?.statusSec !== undefined) {
        return entity.properties.statusSec.getValue() === statusSec;
      }
      return false;
    });
    // 显示
    entities.forEach((entity) => {
      entity.show = true;
    });
    flyToEntities(viewer, entities);
  }

  // 鼠标移入billboard 时的交互
  function setupTunnelEntityEvents(viewer: Cesium.Viewer, dialogRef) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // 记录上一次移入/点击的entity
    let lastHighlighted: Cesium.Entity | null = null;

    // 站点名称弹窗
    const tunnelNameEl = document.getElementById("tunnel-name");

    // 鼠标移动到隧道图标上变成pointer样式
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      const activeEntity = pickedObject?.id;

      // pickedObject?.id是通过 viewer.entities.add(...) 添加的那个 Entity 实例。
      // console.log("pickedObject", pickedObject);
      // console.log("pickedObject.id", pickedObject?.id);
      // console.log("tunnelEntities.includes", tunnelEntities.includes(pickedObject?.id));

      // 针对: 从一个 tunnel billboard 移到另一个 tunnel billboard。 先还原上一次高亮,
      if (lastHighlighted && lastHighlighted !== activeEntity) {
        lastHighlighted.billboard.scale = 1.0;
        lastHighlighted = null;
      }

      // 判断鼠标移入的位置是否时tunnel站点实体
      const isTunnel = activeEntity?.properties?.type?.getValue?.() === "tunnel";
      if (activeEntity && isTunnel) {
        // 避免在同一个实体上重复执行代码
        if (activeEntity === lastHighlighted) return;
        viewer.canvas.style.cursor = "pointer";
        activeEntity.billboard.scale = 1.2;
        lastHighlighted = activeEntity;
        // console.log("active", lastHighlighted);

        // 弹框显示名称
        if (tunnelNameEl) {
          tunnelNameEl.innerText = activeEntity.name ?? "未命名";

          // 世界坐标转屏幕坐标
          const windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
            viewer.scene,
            activeEntity.position.getValue(viewer.clock.currentTime)
          );

          if (windowPosition) {
            tunnelNameEl.style.left = `${windowPosition.x}px`;
            tunnelNameEl.style.top = `${windowPosition.y + 50}px`;
            tunnelNameEl.style.display = "block";
          }
          // console.log("弹窗", tunnelNameEl, tunnelNameEl.innerText, windowPosition);
        }
      }
      // 鼠标不在tunnel站点时
      else {
        viewer.canvas.style.cursor = "default";
        if (lastHighlighted) {
          lastHighlighted.billboard.scale = 1.0;
          lastHighlighted = null;
        }
        // 隐藏弹窗
        if (tunnelNameEl) {
          tunnelNameEl.style.display = "none";
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 点击事件
    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);
      const entity = pickedObject?.id;
      const isTunnel = entity?.properties?.type?.getValue?.() === "tunnel";
      if (entity && isTunnel) {
        dialogRef.value.visible = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  return {
    addTunnelEntities,
    tunnelEntities,
    showTunnelByStatus,
    showAllTunnel,
    setupTunnelEntityEvents,
  };
}

// 抽离重复的飞行逻辑
function flyToEntities(viewer: Cesium.Viewer, entities: Cesium.Entity[]) {
  if (!entities.length) return;
  viewer.flyTo(entities, {
    duration: 3,
    offset: new Cesium.HeadingPitchRange(0.0, -Cesium.Math.PI_OVER_TWO),
  });
}
