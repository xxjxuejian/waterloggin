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
      if (!lon || !lat) return;

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
        },
      });
      tunnelEntities.push(entity);
    });
    viewer.flyTo(tunnelEntities, {
      duration: 3, // 飞行时长（秒）
      offset: new Cesium.HeadingPitchRange(
        0.0, // 0度，朝向正北
        -Cesium.Math.PI_OVER_TWO // -90度，俯视角
      ),
    });
  }

  // 显示全部tunnel
  function showAllTunnel(viewer: Cesium.Viewer) {
    if (tunnelEntities.length === 0) return;
    tunnelEntities.forEach((entity) => {
      entity.show = true;
    });
    viewer.flyTo(tunnelEntities, {
      duration: 3, // 飞行时长（秒）
      offset: new Cesium.HeadingPitchRange(
        0.0, // 0度，朝向正北
        -Cesium.Math.PI_OVER_TWO // -90度，俯视角
      ),
    });
  }

  // 根据添加显示指定status的tunnel
  function showTunnelByStatus(viewer: Cesium.Viewer, statusSec: number) {
    if (tunnelEntities.length === 0) return;
    tunnelEntities.forEach((entity) => {
      entity.show = false;
    });
    const entities = tunnelEntities.filter((entity) => {
      if (entity.properties?.statusSec !== undefined) {
        return entity.properties.statusSec.getValue() === statusSec;
      }
      return false;
    });
    entities.forEach((entity) => {
      entity.show = true;
    });

    console.log("符合条件的实体", entities);

    viewer.flyTo(entities, {
      duration: 3, // 飞行时长（秒）
      offset: new Cesium.HeadingPitchRange(
        0.0, // 0度，朝向正北
        -Cesium.Math.PI_OVER_TWO // -90度，俯视角
      ),
    });
  }

  return {
    addTunnelEntities,
    tunnelEntities,
    showTunnelByStatus,
    showAllTunnel,
  };
}
