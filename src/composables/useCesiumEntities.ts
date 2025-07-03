import * as Cesium from "cesium";

export function useCesiumEntities() {
  // 在地图上添加图标实体
  function addIconEntities(viewer: Cesium.Viewer, data: Array<any>) {
    if (!viewer || !Array.isArray(data)) return;
    data.forEach((item) => {
      const { lon, lat, name } = item;
      if (!lon || !lat) return;

      //   地图上添加的坐标都是三位笛卡尔坐标系
      const position = Cesium.Cartesian3.fromDegrees(parseFloat(lon), parseFloat(lat));

      viewer.entities.add({
        name,
        position,
        billboard: {
          image: "/cesium-icons/texture/map_normal.png",
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
      });
    });
  }

  return {
    addIconEntities,
  };
}
