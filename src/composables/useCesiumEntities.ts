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
  function setupTunnelEntityEvents(
    viewer: Cesium.Viewer,
    onClick?: (entity: Cesium.Entity) => void
  ) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    // 鼠标移动到隧道图标上变成pointer样式
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      // pickedObject?.id是通过 viewer.entities.add(...) 添加的那个 Entity 实例。
      // console.log("pickedObject", pickedObject);
      // console.log("pickedObject.id", pickedObject?.id);
      // console.log("tunnelEntities.includes", tunnelEntities.includes(pickedObject?.id));

      // 判断鼠标移入的位置是否时tunnel站点实体
      const isTunnel = pickedObject?.id?.properties?.type?.getValue?.() === "tunnel";
      viewer.canvas.style.cursor = isTunnel ? "pointer" : "default";
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 点击事件
    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);
      const entity = pickedObject?.id;
      if (entity?.properties?.type?.getValue?.() === "tunnel") {
        onClick?.(entity); // 回调触发逻辑
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
